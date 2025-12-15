"use client";

import React from "react";
import { Button, Input, Link, Divider, Form } from "@heroui/react";
import { Mail } from "lucide-react";
import { GoogleIcon, GithubIcon } from "./icons";

export default function CenteredLoginWithOnlyEmail() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log("handleSubmit");
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
                <p className="pb-2 text-xl font-medium">Log In</p>
                <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input isRequired label="Email Address" name="email" type="email" variant="bordered" />
                    <Button
                        className="w-full"
                        color="primary"
                        startContent={
                            <Mail className="pointer-events-none text-2xl" />
                        }
                        type="submit"
                    >
                        Continue with Email
                    </Button>
                </Form>
                <div className="flex items-center gap-4 py-2">
                    <Divider className="flex-1" />
                    <p className="shrink-0 text-tiny text-default-500">OR</p>
                    <Divider className="flex-1" />
                </div>
                <div className="flex flex-col gap-2">
                    <Button startContent={<GoogleIcon width={24} />} variant="flat">
                        Continue with Google
                    </Button>
                    <Button
                        startContent={<GithubIcon className="text-default-500" width={24} />}
                        variant="flat"
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
