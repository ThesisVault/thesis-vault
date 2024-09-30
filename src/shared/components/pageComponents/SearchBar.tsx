import React from 'react';
import { Input } from '../ui/input'; 
import { Button } from '../ui/button'; 
import { Search } from 'lucide-react'; 
import { Card } from '../ui/card';

function SearchBar() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-3xl font-bold mb-3 text-black/60">Welcome to Library</h1>
      <Card className="w-[850px] h-[80px] bg-[rgba(34,139,34,1)] shadow-lg
                        mb-[180px] flex items-center p-2 rounded-lg">
        <Input
          type="text"
          placeholder="Search..."
          className="flex-grow border-none outline-none placeholder:text-gray-500
                  bg-white text-black h-0.5 w-0.5 rounded-l-lg p-4 ml-5"
        />
        <Button 
          variant="ghost" 
          className="ml-2 mr-5 p-4 h-0.5 flex items-center justify-center rounded-r-lg hover:bg-gray-100 group">
          <Search className="h-5 w-5 text-black group-hover:text-[rgba(34,139,34,1)]" />
        </Button>
      </Card>
    </div>
  );
}

export default SearchBar;