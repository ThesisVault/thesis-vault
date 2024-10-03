import React from 'react';
import { Input } from '../ui/input'; 
import { Button } from '../ui/button'; 
import { Search } from 'lucide-react'; 
import { Card } from '../ui/card';

export const SearchBar = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-3xl font-bold mb-3 text-[hsl(var(--black-low))]">Welcome to Library</h1>
      <Card className="w-[850px] h-[80px] bg-[hsl(var(--custom-green))] shadow-lg
                        mb-[180px] flex items-center p-2 rounded-lg">
        <Input
          type="text"
          placeholder="Search..."
          className="flex-grow border-none outline-none placeholder:text-[hsl(var(--placeholder))]
                  bg-[hsl(var(--white))] text-[hsl(var(--black))] h-0.5 w-0.5 rounded-l-lg p-4 ml-5"
        />
        <Button 
          variant="ghost" 
          className="ml-2 mr-5 p-4 h-0.5 flex items-center justify-center rounded-r-lg hover:bg-[hsl(var(--white))] group">
          <Search className="h-5 w-5 text-[hsl(var(--black] group-hover:text-[hsl(var(--custom-green))]" />
        </Button>
      </Card>
    </div>
  );
};