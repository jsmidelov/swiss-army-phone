
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AddAppButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="outline" 
      onClick={() => navigate('/add-app')}
    >
      Add App
    </Button>
  );
};

export default AddAppButton;
