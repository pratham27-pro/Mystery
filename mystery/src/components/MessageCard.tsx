"use client"
import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}
  

function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast.success(`${response.data.message}`);
        if (message._id && typeof message._id === 'string') {
            onMessageDelete(message._id);
        } else {
            console.error("Invalid message ID");
            toast.error("Error: Invalid message ID");
        }
    }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>

            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive"><X className='w-5 h-5' /></Button>
            </AlertDialogTrigger> 
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>

            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        
    </Card>

  )
}

export default MessageCard;