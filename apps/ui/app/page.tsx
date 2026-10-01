import InstallPWA from "@/components/InstallPWA";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">
        Chinese Vocab
      </h1>

      <div className="mt-6">
        <InstallPWA />
      </div>
    </main>
  );
}