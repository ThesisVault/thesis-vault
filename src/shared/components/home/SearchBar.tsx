import { Input } from '../ui/input'; 
import { Button } from '../ui/button'; 
import { Search } from 'lucide-react'; 
import { Card } from '../ui/card';

export const SearchBar = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-muted-foreground text-center text-3xl font-bold mb-3">Welcome to Library</h1>
      <Card className="w-[850px] h-[80px] mb-44 flex items-center p-2">
        <Input
          type="text"
          placeholder="Search..."
          className="h-0.5 p-4 ml-5"
        />
        <Button 
          variant="ghost" 
          size="search"
          className="ml-2 mr-5 h-1.5">
          <Search className="group-hover:text-primary" />
        </Button>
      </Card>
    </div>
  );
};