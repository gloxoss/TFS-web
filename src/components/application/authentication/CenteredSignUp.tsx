"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Divider, Form } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { GoogleIcon, GithubIcon } from "./icons";

export default function CenteredSignUp() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

    return (
        <div className="flex w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
                <p className="pb-2 text-xl font-medium">Sign Up</p>
                <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={(e) => e.preventDefault()}>
                    <Input
                        isRequired
                        label="Username"
                        name="username"
                        placeholder="Enter your username"
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
                    <Input
                        isRequired
                        endContent={
                            <button type="button" onClick={toggleConfirmVisibility}>
                                {isConfirmVisible ? (
                                    <EyeOff className="pointer-events-none text-2xl text-default-400" />
                                ) : (
                                    <Eye className="pointer-events-none text-2xl text-default-400" />
                                )}
                            </button>
                        }
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        type={isConfirmVisible ? "text" : "password"}
                        variant="bordered"
                    />
                    <Checkbox isRequired className="py-4" size="sm">
                        I agree with the&nbsp;
                        <Link href="#" size="sm">
                            Terms
                        </Link>
                        &nbsp; and&nbsp;
                        <Link href="#" size="sm">
                            Privacy Policy
                        </Link>
                    </Checkbox>
                    <Button color="primary" type="submit">
                        Sign Up
                    </Button>
                </Form>
                <div className="flex items-center gap-4 py-2">
                    <Divider className="flex-1" />
                    <p className="shrink-0 text-tiny text-default-500">OR</p>
                    <Divider className="flex-1" />
                </div>
                <div className="flex flex-col gap-2">
                    <Button
                        startContent={<GoogleIcon width={24} />}
                        variant="bordered"
                    >
                        Sign Up with Google
                    </Button>
                    <Button
                        startContent={<GithubIcon className="text-default-500" width={24} />}
                        variant="bordered"
                    >
                        Sign Up with Github
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
