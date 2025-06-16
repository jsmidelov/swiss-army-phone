
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AddAppDialog = () => {
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

export default AddAppDialog;
