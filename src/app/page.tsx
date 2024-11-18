"use client";

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { erc20Abi, isAddress, parseUnits } from 'viem';
import { getPublicClient, getWalletClient, waitForTransactionReceipt } from "wagmi/actions";
import { wagmiAdapter } from '../../utils/config';
import senderAbi from '../../utils/sender.json';
import { useAccount } from 'wagmi';

const contractAddress = "0x82D8824255aC1030E5F01Ad7984B505Ad9De0C2D"

function parseAddresses(input: string): Array<{ address: string; amount: string }> {
  const lines = input.trim().split('\n');
  const result: Array<{ address: string; amount: string }> = [];

  for (const line of lines) {
    const [address, amountStr] = line.split(',');

    if (!address || !isAddress(address)) {
      toast.error(`Please enter a valid recipient address. ${address} is not a valid address.`);
      throw new Error(`Please enter a valid recipient address. ${address} is not a valid address.`);
    }

    result.push({ address, amount: amountStr });
  }

  return result;
}

export default function Home() {
  const [addresses, setAddresses] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const { address } = useAccount();

  const { mutate: onSend, isPending: isSending } = useMutation({
    mutationFn: async () => {
      const toastId = toast.loading("Sign the transactions to send the tokens.");

      try {
        if (!address) return toast.error("Please connect your wallet.", { id: toastId });
        if (!tokenAddress || !isAddress(tokenAddress))
          return toast.error("Please enter a valid token address.", { id: toastId });

        const existingAddresses = new Map();
        const parsedAddys = [] as string[];
        const parsedAmounts = [] as bigint[];

        const client = getPublicClient(wagmiAdapter.wagmiConfig);
        const walletClient = await getWalletClient(wagmiAdapter.wagmiConfig);

        if (!client) return console.error("no client");

        const allowance = await client.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [address, contractAddress],
        })

        const decimals = await client.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'decimals',
        })

        try {
          const addys = parseAddresses(addresses);

          for (const { address, amount } of addys) {
            const isExisting = existingAddresses.has(address);

            if (isExisting) {
              toast.error(`Duplicate address found: ${address} with amount ${amount}`, { id: toastId });
              throw new Error(`Duplicate address found: ${address} with amount ${amount}`);
            }

            const formattedAmount = parseUnits(amount, decimals);

            parsedAddys.push(address);
            parsedAmounts.push(formattedAmount);
          }
        } catch (e: any) {
          toast.error("Please make sure the addresses and amounts are in a correct format.", { id: toastId });
          throw new Error("Please make sure the addresses and amounts are in a correct format.");
        }

        try {
          const totalAmount = parsedAmounts.reduce((acc, curr) => acc + curr, BigInt(0));

          if (allowance < totalAmount) {
            const { request } = await client.simulateContract({
              account: address,
              abi: erc20Abi,
              address: tokenAddress,
              functionName: "approve",
              args: [contractAddress, totalAmount - allowance]
            });
            const approveHash = await walletClient.writeContract(request);
            await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: approveHash });
          }
        } catch (e) {
          toast.error("Something went wrong while approving the tokens.", { id: toastId });
          throw new Error("Something went wrong while approving the tokens.");
        }

        const { request } = await client.simulateContract({
          account: address,
          abi: senderAbi,
          address: contractAddress,
          functionName: "disperseToken",
          args: [tokenAddress, parsedAddys, parsedAmounts]
        });

        const hash = await walletClient.writeContract(request);
        await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash });
        setTransactionHash(hash)
        toast.success("Tokens sent successfully.", { id: toastId });
      } catch (error) {
        toast.error("Something went wrong while sending the tokens.", { id: toastId });
        console.error(error);
      }
    },
  });

  useEffect(() => {
    setHasHydrated(true);
  }, [])

  return (
    <div className="flex flex-col items-center justify-between min-h-screen font-[family-name:var(--font-geist-sans)]">
      <header className='flex justify-end w-full p-3'>
        <appkit-button />
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 align-bottom justify-center w-full mb-3">
          <Image src="/taiko.svg" height={60} width={60} alt='taiko logo' />
          <h1 className="text-6xl font-bold">Taikosend</h1>
        </div>

        <div className="card w-[700px] shadow-xl p-7 bg-[#efefef]">
          {!!transactionHash ? (
            <div>
              <h2 className="text-4xl font-bold text-center mb-2">All done! 🚀🚀</h2>
              <p className="text-left mb-2">Your tokens have been successfully sent. You can view your transaction here:</p>
              <a className='link' target='_blank' href={`https://hekla.taikoscan.io/tx/${transactionHash}`}>{transactionHash}</a>
            </div>
          ) : <div className='flex flex-col gap-4'>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Token address</span>
              </div>
              <input disabled={isSending} value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} type="text" placeholder="0xAbC" className="input input-bordered w-full" />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Stakeholder details</span>
              </div>
              <textarea disabled={isSending} value={addresses} onChange={(e) => setAddresses(e.target.value)} className="textarea textarea-bordered h-24" placeholder={`0xeD38571DEE9605EDB90323964E2F12Ad026c6C11,10`}></textarea>
            </label>

            <button disabled={isSending || !address || !hasHydrated} onClick={() => onSend()} className={`btn btn-primary mt-2 font-bold text-white hover:bg-primary-hover hover:text-primary rounded-full text-[16px]`}>
              {isSending ? <span className="loading loading-spinner"></span> : ""}
              {!!hasHydrated && address ? "Send" : "Connect wallet"}
            </button>
          </div>}
        </div>

      </main >
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Built with 💚 for the grant factory hackaton
      </footer>
    </div >
  );
}
