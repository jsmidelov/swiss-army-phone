
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { App } from '@/lib/appData';

interface UpdateAppButtonProps {
  app: App;
}

const UpdateAppButton = ({ app }: UpdateAppButtonProps) => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/update-app/${app.id}`);
      }}
    >
      Update App
    </Button>
  );
};

export default UpdateAppButton;
