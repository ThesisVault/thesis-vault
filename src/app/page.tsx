"use client";

import SearchBar from "../shared/components/pageComponents/SearchBar";
import Navbar from "../shared/components/pageComponents/Navbar";
import Footer from "../shared/components/pageComponents/Footer";

export default function Home() {
	return (
		<div className="flex flex-col h-screen">
		<Navbar />
		<div className="flex-grow flex flex-col items-center justify-center">
			<SearchBar />
		</div>
		<Footer />
	</div>

	);
}
