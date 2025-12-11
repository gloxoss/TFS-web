"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Divider, Form } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { AcmeIcon, GoogleIcon, GithubIcon } from "./icons";

export default function LeftLoginWithImageBackground() {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("handleSubmit");
    };

    return (
        <div
            className="flex h-full w-full items-center justify-start overflow-hidden rounded-small bg-content1 p-2 sm:p-4 lg:p-8"
            style={{
                backgroundImage:
                    "url(https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/black-background-texture-2.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Brand Logo */}
            <div className="absolute right-10 top-10">
                <div className="flex items-center">
                    <AcmeIcon className="text-white" width={40} height={40} />
                    <p className="font-medium text-white">ACME</p>
                </div>
            </div>

            {/* Testimonial */}
            <div className="absolute bottom-10 right-10 hidden md:block">
                <p className="max-w-xl text-right text-white/60">
                    <span className="font-medium">“</span>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa
                    volutpat aliquet.
                    <span className="font-medium">”</span>
                </p>
            </div>

            {/* Login Form */}
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
                <p className="pb-2 text-xl font-medium">Log In</p>
                <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        variant="bordered"
                    />
                    <Input
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
                    <div className="flex items-center justify-between px-1 py-2">
                        <Checkbox name="remember" size="sm">
                            Remember me
                        </Checkbox>
                        <Link className="text-default-500" href="#" size="sm">
                            Forgot password?
                        </Link>
                    </div>
                    <Button color="primary" type="submit">
                        Log In
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
                    Need to create an account?&nbsp;
                    <Link href="#" size="sm">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
