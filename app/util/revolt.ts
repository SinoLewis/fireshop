import type { Cart, Destination, Order } from "../stores";
import { user } from "../stores/supa-user";

const REVOLT_EMAIL = import.meta.env.VITE_REVOLT_EMAIL;
const REVOLT_PASS = import.meta.env.VITE_REVOLT_PASS;
const ERROR_ID = import.meta.env.VITE_REVOLT_ERROR;
const AUTH_ID = import.meta.env.VITE_REVOLT_AUTH;
const REVIEW_ID = import.meta.env.VITE_REVOLT_REVIEW;
const ORDERS_ID = import.meta.env.VITE_REVOLT_ORDERS;

async function login() {
    try {
        // Make a POST request to the login endpoint with the provided credentials
        const response = await fetch('https://api.revolt.chat/auth/session/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: REVOLT_EMAIL,
                password: REVOLT_PASS
            })
        });

        // Parse the response as JSON
        const data = await response.json();
        console.log("REVOLT LOGIN: ", data)
        // Return the session token
        return data.token;
    } catch (error) {
        console.error('Revolt login API error:', error);
        throw new Error('Failed to login to Revolt.');
    }
}

async function logout(token) {
    try {
        fetch('https://api.revolt.chat/auth/session/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': token
            },
        });
    } catch (error) {
        console.error('Revolt logout API error:', error);
        throw new Error('Failed to logout to Revolt.');
    }
}

async function error_revolt(message) {
    user.subscribe((async (user) => {
        const token = await login()
        const response = await fetch(`https://api.revolt.chat/channels/${ERROR_ID}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': token
            },
            body: JSON.stringify({
                embeds: [
                    {
                        "description": message,
                        "colour": "#FF0000"
                    }
                ],
                masquerade: {
                    "avatar": user ? user.user_metadata?.avatar_url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRc7YDpfe7-KRj1Y7JAP5R73L-RLKcLTWbEjWQ84B2&s",
                    "name": user ? user.email : "No USER"
                }
            })
        });

        // Parse the response as JSON
        const data = await response.json();
        logout(token)
        console.log("REVOLT ERROR: ", data)

    }))
}

async function auth(message) {
    user.subscribe((async (user) => {
        const token = await login()
        const response = await fetch(`https://api.revolt.chat/channels/${AUTH_ID}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': token
            },
            body: JSON.stringify({
                embeds: [
                    {
                        "description": message,
                        "colour": "#008000"
                    }
                ],
                masquerade: {
                    "avatar": user ? user.user_metadata?.avatar_url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRc7YDpfe7-KRj1Y7JAP5R73L-RLKcLTWbEjWQ84B2&s",
                    "name": user ? user.email : "No USER"
                }
            })
        });

        // Parse the response as JSON
        const data = await response.json();
        logout(token)
        console.log("REVOLT AUTH: ", data)

    }))
}

async function review(message) {
    user.subscribe((async (user) => {
        const token = await login()
        const response = await fetch(`https://api.revolt.chat/channels/${REVIEW_ID}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': token
            },
            body: JSON.stringify({
                embeds: [
                    {
                        "description": message,
                        "colour": "#0000FF"
                    }
                ],
                masquerade: {
                    "avatar": user ? user.user_metadata?.avatar_url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRc7YDpfe7-KRj1Y7JAP5R73L-RLKcLTWbEjWQ84B2&s",
                    "name": user ? user.email : "No USER"
                }
            })
        });

        // Parse the response as JSON
        const data = await response.json();
        logout(token)
        console.log("REVOLT REVIEW: ", data)
    }))
}

async function orders_revolt(order: Order,
    cart: Cart,
    destination: Destination) {
    // let items: any = Object.values(cart.cart_products).map((item) => {
    //     return {
    //         title: item.title,
    //         description: `PRICE: ${item.price}, QUANTITY: ${item.quantity}`,
    //         colour: "#0000FF",
    //         icon_url: item.image,
    //     };
    // });
    let details = [
        {
            title: "ADDRESS",
            description: `${destination?.label}`,
            colour: "#FF0000",
        },
        {
            title: "PHONE",
            description: `${order.phone}`,
            colour: "#00FF00",
        },
        {
            title: "CART",
            description: `CART PRICE: ${cart.cart_price} CART QTY: ${cart.cart_total}`,
            colour: "#0000FF",
        }
    ]
    // const embeds = details.concat(items);
    const token = await login()
    user.subscribe((async (user) => {
        const response = await fetch(`https://api.revolt.chat/channels/${ORDERS_ID}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': token
            },
            body: JSON.stringify({
                content: `${order.id}`,
                embeds: details,
                masquerade: {
                    "avatar": user ? user.user_metadata?.avatar_url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRc7YDpfe7-KRj1Y7JAP5R73L-RLKcLTWbEjWQ84B2&s",
                    "name": user ? user.email : "No USER"
                }
            })
        });
        // Parse the response as JSON
        const data = await response.json();
        logout(token)
        console.log("REVOLT ORDERS: ", data)
    }))
}
export { error_revolt, auth, review, login, logout, orders_revolt }