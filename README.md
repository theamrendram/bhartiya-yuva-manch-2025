## pages

### Homepage

- herosetion
- about section
  - about R10 IEEE Computer Society Summer School 2025
  - about ieee cs chapter of r-10
  - about bvicam
  - gallery
- speakers
- guidelines
- schedule
- faq
- venue
- footer

### registration page

- registration form
  - multi-step form
  - full name, email, phone, gender, ieee cs chapter member(checkbox), ieee membership id, id card upload, password, institution/company, designation

### login page

email and password based login

### profile page

- display profile data
- input to upload payment screenshot


### dashboard 
- users list in tabular format 
- admin can approve registration and send payment link using a single endpoint:

#### Admin Approval & Payment Link API
- Endpoint: `/api/admin/users/approve-registration`
- Use this endpoint to approve a user and/or send a payment link.
- Accepts in the POST body:
  - `userId` (required)
  - `paymentAmount` (optional, overrides default)
  - `schedulePdfLink` (optional, overrides default)
  - `qrCodeImage` (optional, overrides default)
  - `paymentLink` (optional, overrides default)
- If optional fields are not provided, sensible defaults are used.
- This endpoint replaces the previous `send-payment-request` and `verify` endpoints.


## tech stack
nextjs, tanstack table, mongodb, zod, cloudinary, node emailer (for otp and other info), motion.dev, shadcn ui and aceternity ui


# bhartiya-yuva-manch-2025
