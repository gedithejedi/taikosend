import Image from 'next/image';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-6 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 align-bottom justify-center w-full mb-3">
          <Image src="/taiko.svg" height={60} width={60} alt='taiko logo' />
          <h1 className="text-6xl font-bold">Taikosend</h1>
        </div>

        <div className="card w-[700px] shadow-xl p-7 bg-[#efefef]">
          {/* <h2 className="text-3xl font-bold mb-4 text-center">Disperse details</h2> */}
          <div className='flex flex-col gap-4'>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Token address</span>
              </div>
              <input type="text" placeholder="0xAbC" className="input input-bordered w-full" />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Stakeholder details</span>
              </div>
              <textarea className="textarea textarea-bordered h-24" placeholder={`address,amount \n0xeD38571DEE9605EDB90323964E2F12Ad026c6C11,10`}></textarea>
            </label>

            <button className="btn btn-primary mt-2 font-bold text-white hover:bg-primary-hover hover:text-primary rounded-full text-[16px]">Deploy</button>
          </div>
        </div>

      </main >
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Built with 💚 for the grant factory hackaton
      </footer>
    </div >
  );
}
