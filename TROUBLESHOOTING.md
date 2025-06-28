# Troubleshooting Guide

## Common Development Issues

### 1. Next.js Server Issues

#### Restart Development Server
If you're getting 404 errors or need to restart the Next.js server:
```bash
# Safely kill Next.js server and restart
kill $(lsof -t -i:3000) 2>/dev/null || true && pnpm dev
```

#### Chunk Errors
If you encounter chunk errors or webpack-related issues, try these solutions in order:

1. **Basic Cache Clear**
```bash
# Remove Next.js build cache and node_modules cache
rm -rf .next node_modules/.cache && pnpm install && pnpm dev
```

2. **Complete Cleanup** (if basic clear doesn't work)
```bash
# Remove all build files and dependencies, then reinstall
rm -rf .next node_modules && pnpm install && NEXT_WEBPACK=false pnpm dev
```

### 2. Browser-side Issues

#### Clear Browser Cache
1. Hard refresh: `Cmd/Ctrl + Shift + R`
2. In Chrome DevTools:
   - Open DevTools (`Cmd/Ctrl + Option + I`)
   - Go to Network tab
   - Check "Disable cache"
   - Keep DevTools open while developing

#### Clear Site Data
If issues persist:
1. Go to browser settings
2. Find "Clear browsing data"
3. Clear data for localhost/development URL
4. Restart browser

### 3. Environment Variables

If environment variables aren't being recognized:
1. Ensure `.env.local` exists in project root
2. Check that variables are properly formatted:
```env
NEXT_PUBLIC_SITE_URL=https://speedyfastpass.com
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```
3. Restart Next.js development server
4. Refresh browser page

### 4. Stripe Integration Issues

#### Environment Variables
1. Verify environment variables are set correctly in `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

#### Automatic Setup
The application automatically creates Stripe products, prices, and coupons on first use. No manual Stripe dashboard setup required!

#### Test Cards
Use these test card numbers for development:
- **Success**: `4242 4242 4242 4242`
- **Authentication Required**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 0002`
- Any future expiry date (e.g., 12/34)
- Any CVC (e.g., 123)

#### Common Stripe Errors
- **"No such price" errors**: Fixed automatically with new auto-creation system
- **Invalid API key**: Check your `.env.local` file and restart server
- **Network errors**: Check internet connection and Stripe status

## Development Best Practices

1. **Regular Cleanup**
   - Periodically clean `.next` and cache
   - Keep dependencies up to date with `pnpm install`

2. **Environment Variables**
   - Never commit `.env.local` to git
   - Keep `.env.example` updated with required variables

3. **Testing Changes**
   - Clear cache before testing major changes
   - Test in incognito/private window for clean state
   - Test on multiple browsers if possible

## Need More Help?

If issues persist after trying these solutions:
1. Check Next.js [documentation](https://nextjs.org/docs)
2. Check Stripe [documentation](https://stripe.com/docs)
3. Review error messages in:
   - Browser console
   - Terminal/server logs
   - Network tab in DevTools 