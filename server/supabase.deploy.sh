#!/bin/bash

# Wait until ngrok server is fully established
while true; do
    status=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:4040/api/tunnels)
    echo "Checking Ngrok server is up ..."
    if [ "$status" -eq "200" ]; then
        sleep 5
        echo "NGROK_URL is: $(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')"
        supabase secrets set NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
        echo "NGROK_URL set as: $(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')"
        break
    fi
    sleep 1
done
# NGROK_URL=$(curl http://localhost:4040/api/tunnels | grep -oP 'public_url":"\K[^"]+' | awk '{print $1}');

# Start supabase edge deployment
for dir in $(find ../supabase/functions -maxdepth 1 -type d  -not -name '_types' -not -name '_shared' -not -path '*/\.*' -printf '%f\n'); do supabase functions deploy "$dir" --no-verify-jwt; done
