"use client";

import { useEffect } from "react";

export function ConsoleCredit() {
    useEffect(() => {
        console.log(
            '%c STOP! \n%c This system architecture is the intellectual property of Epioso.tech. \n For maintenance access: zakiossama28@gmail.com',
            'color: red; font-size: 20px; font-weight: bold;',
            'color: white; background: #333; padding: 5px;'
        );
    }, []);
    return null;
}
