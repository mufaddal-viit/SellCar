FUTURE SCOPE
create a new section "EMail Templates" in admin to display all email template, edit and create new template.


what i was thinking is that, we can have a feature of car display on hover on /service page on choose your car dropdown.


TESTING STEPS:
Full testing guide
0. One-time setup
In .env make sure these are set: MONGODB_URI, AUTH_SECRET, ADMIN_EMAIL, all EMAIL_* (Gmail app password), all CLOUDINARY_* (+ the two NEXT_PUBLIC_CLOUDINARY_*).
Stop and start the dev server: npm run dev (env loads only at startup).
1. Admin login (new OTP)
Go to http://localhost:3000/admin → it redirects to /admin/login.
Enter a wrong email → "Send code" → should say not authorized. ✅ denies non-admin.
Enter your ADMIN_EMAIL → "Send code" → check that inbox for the 6-digit code.
Enter the code → "Verify & sign in" → lands on the dashboard. Try a wrong code first → "Incorrect code". ✅
2. Dashboard (grouped stats)
Confirm four labelled groups in order: Sales → Applications → Cars → Other.
Applications group shows Total/New/In Review/Approved/Rejected.
Other group shows Customers = 3, enquiries, WhatsApp/call clicks.
3. Customers page (/admin/customers)
See your 3 customers (from leads/applications).
Filter by status (top-left dropdown).
Add customer → fill name + email/phone → Save → appears in list.
Change a customer's status inline (dropdown).
Copy phone: click the 📋 next to a phone → green check (copied); click the number → dialer.
Bulk email: tick 1+ customers → a red bar appears → pick a template → Send email → it reports sent / skipped / failed. (Use a customer whose email is yours to actually receive it.) Per-row ✉ selects just that one.
Unsubscribe: open the promo email → click Unsubscribe → confirmation page; that customer now shows "(opted out)" and is skipped on future sends.
4. Applications (apply → review → status)
Submit (public):

/services → pick a car from the dropdown, fill Name/Mobile, enter your email → Send code → enter code → Verify (green ✓).
Upload the 4 required docs (any image/PDF) → Submit → success screen with a "Check status" link.
Admin review:
3. /admin/applications → new application appears; URL uses the name slug (e.g. /admin/applications/your-name-xxxx), not an ObjectId. ✅
4. Open it → copy phone works; documents open via secure links (expire in 15 min).
5. Set status Approved (or Rejected + note) → "Update & notify applicant" → check your inbox for the premium approved/rejected email.

Status page (public):
6. /services/application-status → enter the same email → OTP → see the application status, reference, and (if rejected) the reason.

5. Emails (premium template)
Every email (OTP, Approved, Rejected, Promo) should now have: branded header, body, and a footer with business name, address, phone, email, and Instagram/Facebook/TikTok. Verify on any one you receive.

6. Public site
Home hero: each slide shows a different small tag (no "01/03" numbers); the bottom stats strip has clean borders on mobile (2×2 grid, no stray lines).
Testimonials: single swipable card, screenshots shown uncropped, glassy ◀ ▶ buttons, no dots, drag works.
Eligibility section: numbered card (01–06) with check marks + "Start your application" + "No credit-score impact" line. The footer "Check Eligibility" link scrolls here.
Footer: "Application Status" works; "How EMI Works / Terms / Privacy" show coming-soon pages (not 404); Instagram/Facebook/TikTok links correct.
No Unsplash anywhere (about + testimonials use local images).
7. Copy-phone everywhere
Check the 📋 copy + 📞 call control on phone numbers in Customers, Applications (list + detail), and Leads.

When you've set ADMIN_EMAIL and tested, tell me and I'll run a production build to confirm everything's release-ready. Anything that misbehaves during testing, send me the detail and I'll fix it.