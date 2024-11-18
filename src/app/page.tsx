"use client";

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { erc20Abi, isAddress, parseUnits } from 'viem';
import { getPublicClient, getWalletClient } from "wagmi/actions";
import { wagmiAdapter } from '../../utils/config';
import senderAbi from '../../utils/sender.json';

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

  const { mutate: onSend, isPending: isSending } = useMutation({
    mutationFn: async () => {
      const toastId = toast.loading("Sign the transactions to send the tokens.");

      try {
        if (!tokenAddress || !isAddress(tokenAddress))
          return toast.error("Please enter a valid token address.", { id: toastId });

        const existingAddresses = new Map();
        const parsedAddys = [] as string[];
        const parsedAmounts = [] as bigint[];

        const client = getPublicClient(wagmiAdapter.wagmiConfig);
        const walletClient = await getWalletClient(wagmiAdapter.wagmiConfig);
        const [account] = await walletClient.getAddresses();

        if (!client) return console.error("no client");

        const decimals = await client.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'decimals',
        })

        console.log(decimals);

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

        console.log({
          account,
          abi: senderAbi,
          address: "contractAddress" as `0x${string}`,
          functionName: "disperseToken",
          args: [tokenAddress, parsedAddys, parsedAmounts]
        });

        // const { request } = await client.simulateContract({
        //   account,
        //   abi: senderAbi,
        //   address: contractAddress as `0x${string}`,
        //   functionName: "disperseToken",
        //   args: [tokenAddress, parsedAddys, parsedAmounts]
        // });

        // await walletClient.writeContract(request);
        toast.success("Tokens sent successfully.", { id: toastId });
      } catch (error) {
        toast.error("Something went wrong while sending the tokens.", { id: toastId });
        console.error(error);
      }
    },
  });

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
          <div className='flex flex-col gap-4'>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Token address</span>
              </div>
              <input value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} type="text" placeholder="0xAbC" className="input input-bordered w-full" />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Stakeholder details</span>
              </div>
              <textarea value={addresses} onChange={(e) => setAddresses(e.target.value)} className="textarea textarea-bordered h-24" placeholder={`0xeD38571DEE9605EDB90323964E2F12Ad026c6C11,10`}></textarea>
            </label>

            <button disabled={isSending} onClick={() => onSend()} className={`btn btn-primary mt-2 font-bold text-white hover:bg-primary-hover hover:text-primary rounded-full text-[16px]`}>
              {isSending ? <span className="loading loading-spinner"></span> : ""}
              Deploy
            </button>
          </div>
        </div>

      </main >
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Built with 💚 for the grant factory hackaton
      </footer>
    </div >
  );
}
