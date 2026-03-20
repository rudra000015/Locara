export default function RegisterShop() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-zinc-900 border border-[#b87333]/30 p-10 rounded-3xl shadow-2xl">
        <h1 className="text-[#b87333] text-4xl font-black mb-2">Register Your Haat</h1>
        <p className="text-zinc-400 mb-8">Join the elite circle of local artisans and heritage sellers.</p>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Shop Name" className="bg-zinc-800 border-none p-4 rounded-xl text-white outline-none focus:ring-2 ring-[#b87333]" />
            <select className="bg-zinc-800 border-none p-4 rounded-xl text-zinc-400 outline-none">
              <option>Select Category</option>
              <option>Handicrafts</option>
              <option>Spices</option>
            </select>
          </div>
          <textarea placeholder="Shop Description" className="w-full bg-zinc-800 border-none p-4 rounded-xl text-white h-32" />
          <button className="w-full py-4 bg-[#b87333] text-white font-black text-xl rounded-xl hover:scale-[1.02] transition-transform">
            Launch My Shop
          </button>
        </form>
      </div>
    </div>
  );
}