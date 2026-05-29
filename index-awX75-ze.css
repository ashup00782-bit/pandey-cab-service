/*
  # Fix RLS Policies for Inquiries Table

  ## Security Vulnerabilities Fixed
  
  This migration addresses critical security issues where RLS policies were using 
  `USING (true)` or `WITH CHECK (true)` clauses, effectively bypassing row-level security.
  
  ### Issues Fixed:
  1. DELETE policy "Admins can delete inquiries" - was using `USING (true)` allowing any 
     authenticated user to delete any inquiry
  2. UPDATE policy "Admins can update inquiries" - was using `USING (true)` and 
     `WITH CHECK (true)` allowing any authenticated user to modify any inquiry
  3. INSERT policy "Anyone can submit inquiries" - was using `WITH CHECK (true)` which 
     is acceptable for public contact forms, but we're tightening it to validate data
  
  ### Changes Made:
  
  **Policies Dropped:**
  - "Anyone can submit inquiries" (INSERT)
  - "Admins can view all inquiries" (SELECT)
  - "Admins can update inquiries" (UPDATE)
  - "Admins can delete inquiries" (DELETE)
  
  **New Policies Created:**
  
  1. **"Anyone can submit inquiries" (INSERT)**
     - Allows anon and authenticated users to create new inquiries
     - Validates that required fields are present (name, phone_number, travel_date, 
       service_type, lead_status)
     - Ensures lead_status is a valid value ('new', 'contacted', 'converted', 'lost')
     - This is appropriate for a public contact/inquiry form
  
  2. **"Admins can view all inquiries" (SELECT)**
     - Restricted to authenticated users with role 'admin' in their app_metadata
     - Uses secure auth.jwt() -> 'app_metadata' -> 'role' check
     - Only admins can view sensitive customer inquiries
  
  3. **"Admins can update inquiries" (UPDATE)**
     - Restricted to authenticated admin users only
     - Uses WITH CHECK to validate updated data meets same standards as INSERT
     - Ensures admin can only update with valid lead_status values
  
  4. **"Admins can delete inquiries" (DELETE)**
     - Restricted to authenticated admin users only
     - Prevents unauthorized deletion of inquiry records
  
  ### Security Model:
  
  - **Public customers** (anon/authenticated): Can only submit new inquiries via contact form
  - **Admin users**: Full CRUD access to manage inquiry records
  - Admin role is determined by `app_metadata.role = 'admin'` in the user's JWT
  - This follows the principle of least privilege - users can only access what they need
  
  ### Notes:
  
  1. To make a user an admin, update their `raw_app_meta_data` via Supabase Auth:
     ```sql
     UPDATE auth.users 
     SET raw_app_meta_data = jsonb_set(
       COALESCE(raw_app_meta_data, '{}'::jsonb),
       '{role}',
       '"admin"'
     )
     WHERE id = 'user-uuid-here';
     ```
  
  2. The INSERT policy allows anonymous submissions which is appropriate for a 
     public contact form. However, we validate the data to prevent obvious abuse.
  
  3. All policies use `auth.uid()` and `auth.jwt()` for security - these are 
     Supabase built-in functions that cannot be manipulated by clients.
*/

-- Drop the insecure existing policies
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON inquiries;

-- Create secure INSERT policy for public submissions
-- This allows anyone to submit inquiries (contact form) but validates the data
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Validate required fields are present
    name IS NOT NULL 
    AND length(trim(name)) > 0
    AND phone_number IS NOT NULL 
    AND length(trim(phone_number)) >= 10
    AND travel_date IS NOT NULL
    AND service_type IS NOT NULL
    AND lead_status IN ('new', 'contacted', 'converted', 'lost')
  );

-- Create secure SELECT policy - only admins can view inquiries
CREATE POLICY "Admins can view all inquiries"
  ON inquiries
  FOR SELECT
  TO authenticated
  USING (
    -- Check if user has admin role in app_metadata
    -- app_metadata cannot be modified by users, making this secure
    COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'role'),
      ''
    ) = 'admin'
  );

-- Create secure UPDATE policy - only admins can update inquiries
CREATE POLICY "Admins can update inquiries"
  ON inquiries
  FOR UPDATE
  TO authenticated
  USING (
    -- Must be admin to update
    COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'role'),
      ''
    ) = 'admin'
  )
  WITH CHECK (
    -- Validate the updated data meets same standards
    name IS NOT NULL 
    AND length(trim(name)) > 0
    AND phone_number IS NOT NULL 
    AND length(trim(phone_number)) >= 10
    AND travel_date IS NOT NULL
    AND service_type IS NOT NULL
    AND lead_status IN ('new', 'contacted', 'converted', 'lost')
  );

-- Create secure DELETE policy - only admins can delete inquiries
CREATE POLICY "Admins can delete inquiries"
  ON inquiries
  FOR DELETE
  TO authenticated
  USING (
    -- Must be admin to delete
    COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'role'),
      ''
    ) = 'admin'
  );
