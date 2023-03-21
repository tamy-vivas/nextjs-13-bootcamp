"use client";

import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthModalInput from './AuthModalInput';
import useAuth from '../../hooks/useAuth';
import { AuthenticationContext } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

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
    const [disable, setDisable] = useState(true);
    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        email: 'tamy.vivas@email.com',
        phone: '',
        city: '',
        password: 'Tamy.vivas123',
    });
    const { signin, signup } = useAuth();
    const { data, error, loading } = useContext(AuthenticationContext);


    useEffect(() => {
        if (isSignin) {
            if (inputs.password && inputs.email) {
                return setDisable(false);
            }
        } else {
            if (inputs.city && inputs.email && inputs.firstName && inputs.lastName && inputs.password && inputs.phone) {
                return setDisable(false);
            }
        }
        setDisable(true);
    }, [inputs]);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs((currentSate) => ({
            ...currentSate,
            [e.target.name]: e.target.value
        }))
    }

    const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isSignin) {
            signin({ email: inputs.email, password: inputs.password });
        }
    }

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
                    {loading ? <div className="px-2 py-24 h-[600px] flex justify-center">
                        <CircularProgress />
                    </div> : <div className="p-2 h-[600px]">
                        <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                            <p className="text-sm">
                                {isSignin ? "Sign in" : "Create Account"}

                            </p>
                        </div>
                        <div className="m-auto ">
                            <h2 className="text-2xl font-light text-center">
                                {isSignin ? "Log Into Your Account" : "Create Your Opentable Account"}
                            </h2>
                            <AuthModalInput
                                inputs={inputs}
                                handleInputChange={handleInputChange}
                                isSignin={isSignin}
                            />
                            <button className="uppercase bg-red-600 w-full p-3 text-white rounded text-sm disabled:bg-gray-400"
                                disabled={disable}
                                onClick={handleClick}
                            >
                                {isSignin ? "Sign In" : "Create Account"}

                            </button>
                        </div>
                    </div>}
                </Box>
            </Modal>
        </div>
    );
}
