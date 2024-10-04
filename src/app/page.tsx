"use client";

import { SearchBar } from "../shared/components/home/SearchBar";
import { Navbar } from "../shared/components/common/Navbar";
import { Footer } from "../shared/components/common/Footer";

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
