import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navigationbar";
import { SearchBar } from "@/components/home/SearchBar";

export default async function Home() {
	return (
		<div className="flex flex-col h-screen p-0 m-0">
			<Navbar />
			<div className="flex-grow flex flex-col items-center justify-center">
				<SearchBar />
			</div>
			<Footer />
		</div>
	);
}
