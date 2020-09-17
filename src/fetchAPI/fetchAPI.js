import React from 'react';

export default async function fetchAPI(url,body,method){
    const option = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return await fetch(url, option)
        .then(response => response.json())
        .then(data => data)
        .catch(err => err);
}