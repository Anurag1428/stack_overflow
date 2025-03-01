import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action';

export async function POST(req: Request) {

    
    
    // 1. Get the webhook signing secret
    const SIGNING_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

    if (!SIGNING_SECRET) {
        console.error('Error: NEXT_CLERK_WEBHOOK_SECRET is not defined');
        return new Response('Error: Missing SIGNING_SECRET', { status: 500 });
    }

    // 2. Create a new Webhook instance with the signing secret
    const wh = new Webhook(SIGNING_SECRET);

    // 3. Get the Svix headers for verification
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error('Error: Missing Svix headers', {
            svix_id,
            svix_timestamp,
            has_signature: !!svix_signature
        });
        return new Response('Error: Missing Svix headers', { status: 400 });
    }

    // 4. Get the request body
    let payload;
    try {
        payload = await req.json();
    } catch (err) {
        console.error('Error: Could not parse request body', err);
        return new Response('Error: Invalid request body', { status: 400 });
    }
    
    const body = JSON.stringify(payload);

    // 5. Verify the webhook signature
    let evt: WebhookEvent;
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error: Could not verify webhook:', err);
        return new Response('Error: Verification error', { status: 400 });
    }

    // 6. Get the event type and log it
    const eventType = evt.type;
    console.log(`Processing webhook event: ${eventType}`, { 
        userId: evt.data.id, 
        timestamp: new Date().toISOString() 
    });
    
    // 7. Handle user.created event
    if (eventType === 'user.created') {
        try {
            const { id, email_addresses, image_url, username, first_name, last_name } = evt.data;

            // Handle potentially missing data
            const email = email_addresses && email_addresses.length > 0 
                ? email_addresses[0].email_address 
                : '';
            
            const usernameToUse = username || `user_${id.slice(-6)}`;
            
            const mongoUser = await createUser({
                clerkId: id,
                name: `${first_name || ''}${last_name ? ` ${last_name}` : ''}`,
                username: usernameToUse,
                email: email,
                picture: image_url,
            });

            console.log(`User created successfully: ${id}`);
            return new Response(JSON.stringify({ message: 'User created', user: mongoUser }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        } catch (error) {
            console.error('Error creating user in database:', error);
            // Return 200 to Clerk so it doesn't retry repeatedly
            return new Response(JSON.stringify({ message: 'Received but failed to process user creation' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }
    }


    // Add this before the try/catch for verification
console.log('Headers received:', {
    svix_id,
    svix_timestamp,
    svix_signature_length: svix_signature?.length
  });
  console.log('Payload length:', body.length);

  


  // At the start of your webhook handler
if (evt.type === 'user.created' || evt.type === 'user.updated') {
    console.log('Webhook received:', {
        eventType: evt.type,
        userId: evt.data.id,
        timestamp: new Date().toISOString(),
        imageUpdated: evt.data.image_url !== undefined
    });
} else {
    console.log('Webhook received:', {
        eventType: evt.type,
        userId: evt.data.id,
        timestamp: new Date().toISOString()
    });
}


    // 8. Handle user.updated event
    if (eventType === 'user.updated') {
        try {
            const { id, email_addresses, image_url, username, first_name, last_name } = evt.data;

            // Log the data we're working with for debugging
            console.log('Updating user with data:', {
                id,
                hasEmailAddresses: !!email_addresses && email_addresses.length > 0,
                image_url,
                username,
                first_name,
                last_name
            });

            // Handle potentially missing data
            const email = email_addresses && email_addresses.length > 0 
                ? email_addresses[0].email_address 
                : '';
            
            const usernameToUse = username || `user_${id.slice(-6)}`;
            
            const mongoUser = await updateUser({
                clerkId: id,
                updateData: {
                    name: `${first_name || ''}${last_name ? ` ${last_name}` : ''}`,
                    username: usernameToUse,
                    email: email,
                    picture: image_url,
                },
                path: `/profile/${id}`,
            });

            console.log(`User updated successfully: ${id}`);
            return new Response(JSON.stringify({ message: 'User updated', user: mongoUser }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        } catch (error) {
            console.error('Error updating user in database:', error);
            // Return 200 to Clerk so it doesn't retry repeatedly
            return new Response(JSON.stringify({ message: 'Received but failed to process user update' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }
    }

    // 9. Handle user.deleted event
    if (eventType === 'user.deleted') {
        try {
            const { id } = evt.data;

            if (!id) {
                throw new Error('Missing user id in deletion event');
            }

            await deleteUser({ clerkId: id });

            console.log(`User deleted successfully: ${id}`);
            return new Response(JSON.stringify({ message: 'User deleted' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        } catch (error) {
            console.error('Error deleting user from database:', error);
            // Return 200 to Clerk so it doesn't retry repeatedly
            return new Response(JSON.stringify({ message: 'Received but failed to process user deletion' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }
    }

    // 10. Acknowledge other event types
    console.log(`Received unhandled webhook event type: ${eventType}`);
    return new Response(JSON.stringify({ message: 'Webhook received' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    });
}