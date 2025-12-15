"use client";

import type { InputProps } from "@heroui/react";

import React from "react";
import { Button, Input, Checkbox, Link, Divider, Form } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { GoogleIcon, GithubIcon } from "./icons";

export default function CenteredSignUpWithBlurredContainer() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

    const inputClasses: InputProps["classNames"] = {
        inputWrapper:
            "border-transparent bg-default-50/40 dark:bg-default-50/20 group-data-[focus=true]:border-primary data-[hover=true]:border-foreground/20",
    };

    const buttonClasses = "w-full bg-foreground/10 dark:bg-foreground/20";

    return (
        <div className="flex w-full items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-2 sm:p-4 lg:p-8">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-background/60 px-8 pb-10 pt-6 shadow-small backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
                <p className="pb-2 text-xl font-medium">Sign Up</p>
                <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={(e) => e.preventDefault()}>
                    <Input
                        isRequired
                        classNames={inputClasses}
                        label="Username"
                        name="username"
                        placeholder="Enter your username"
                        type="text"
                        variant="bordered"
                    />
                    <Input
                        isRequired
                        classNames={inputClasses}
                        label="Email Address"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        variant="bordered"
                    />
                    <Input
                        isRequired
                        classNames={inputClasses}
                        endContent={
                            <button type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <EyeOff className="pointer-events-none text-2xl text-foreground/50" />
                                ) : (
                                    <Eye className="pointer-events-none text-2xl text-foreground/50" />
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
                        classNames={inputClasses}
                        endContent={
                            <button type="button" onClick={toggleConfirmVisibility}>
                                {isConfirmVisible ? (
                                    <EyeOff className="pointer-events-none text-2xl text-foreground/50" />
                                ) : (
                                    <Eye className="pointer-events-none text-2xl text-foreground/50" />
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
                        <Link className="text-foreground/50" href="#" size="sm">
                            Terms
                        </Link>
                        &nbsp; and&nbsp;
                        <Link className="text-foreground/50" href="#" size="sm">
                            Privacy Policy
                        </Link>
                    </Checkbox>
                    <Button className={buttonClasses} type="submit">
                        Sign Up
                    </Button>
                </Form>
                <div className="flex items-center gap-4 py-2">
                    <Divider className="flex-1" />
                    <p className="shrink-0 text-tiny text-default-500">OR</p>
                    <Divider className="flex-1" />
                </div>
                <div className="flex flex-col gap-2">
                    <Button className={buttonClasses} startContent={<GoogleIcon width={24} />}>
                        Sign Up with Google
                    </Button>
                    <Button className={buttonClasses} startContent={<GithubIcon width={24} />}>
                        Sign Up with Github
                    </Button>
                </div>
                <p className="text-center text-small text-foreground/50">
                    Already have an account?&nbsp;
                    <Link color="foreground" href="#" size="sm">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
