
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { App } from '@/lib/appData';

interface UpdateAppDialogProps {
  app: App;
}

const UpdateAppDialog = ({ app }: UpdateAppDialogProps) => {
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

export default UpdateAppDialog;
