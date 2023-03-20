"use client";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import AuthModalInput from './AuthModalInput';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function AuthModal({ isSignin }: { isSignin: boolean }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const buttonStyle = isSignin ? 'bg-blue-400 text-white border p-1 px-4 rounded mr-3' : 'border p-1 px-4 rounded';
    return (
        <div>
            <button
                className={buttonStyle}
                onClick={handleOpen}
            >
                {isSignin ? "Sign in" : "Sign up"}
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="p-2 h-[600px]">
                        <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                            <p className="text-sm">
                                {isSignin ? "Sign in" : "Create Account"}

                            </p>
                        </div>
                        <div className="m-auto ">
                            <h2 className="text-2xl font-light text-center">
                                {isSignin ? "Log Into Your Account" : "Create Your Opentable Account"}
                            </h2>
                            <AuthModalInput />
                            <button className="uppercase bg-red-600 w-full p-3 text-white rounded text-sm disabled:bg-gray-400">
                                {isSignin ? "Sign In" : "Create Account"}

                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
