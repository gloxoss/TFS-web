"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Divider, Form } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { AcmeIcon, GoogleIcon, GithubIcon } from "./icons";

export default function CenteredSignUpWithTopLogo() {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("handleSubmit");
    };

    return (
        <div className="flex h-full  w-full flex-col items-center justify-center">
            <div className="flex flex-col items-center pb-6">
                <AcmeIcon size={60} className="text-foreground" />
                <p className="text-xl font-medium">Create an account</p>
                <p className="text-small text-default-500">to continue to Acme</p>
            </div>
            <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
                <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        label="Full Name"
                        name="name"
                        placeholder="Enter your name"
                        type="text"
                        variant="bordered"
                    />
                    <Input
                        isRequired
                        label="Email Address"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        variant="bordered"
                    />
                    <Input
                        isRequired
                        endContent={
                            <button type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <EyeOff className="pointer-events-none text-2xl text-default-400" />
                                ) : (
                                    <Eye className="pointer-events-none text-2xl text-default-400" />
                                )}
                            </button>
                        }
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                    />
                    <div className="flex w-full items-center gap-2 py-2">
                        <Checkbox name="terms" size="sm">
                            I agree to the <Link href="#">Terms</Link> and <Link href="#">Privacy Policy</Link>
                        </Checkbox>
                    </div>
                    <Button className="w-full" color="primary" type="submit">
                        Sign Up
                    </Button>
                </Form>
                <div className="flex items-center gap-4">
                    <Divider className="flex-1" />
                    <p className="shrink-0 text-tiny text-default-500">OR</p>
                    <Divider className="flex-1" />
                </div>
                <div className="flex flex-col gap-2">
                    <Button
                        startContent={<GoogleIcon width={24} />}
                        variant="bordered"
                    >
                        Continue with Google
                    </Button>
                    <Button
                        startContent={<GithubIcon className="text-default-500" width={24} />}
                        variant="bordered"
                    >
                        Continue with Github
                    </Button>
                </div>
                <p className="text-center text-small">
                    Already have an account?&nbsp;
                    <Link href="#" size="sm">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
