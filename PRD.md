# Product Requirements Document
## Lost Pet Finder

**Version:** 1.0
**Author:** Grade 6 Class Project
**Status:** Approved

---

## Table of Contents
1. Overview
2. Who is the site for?
3. What problem does it solve?
4. Site Basics
5. User Types
6. User Stories
7. User Flows
8. Page-by-Page Requirements
   - 8.1 Home Page
   - 8.2 Help Page
   - 8.3 Lost Pet Form
   - 8.4 Report a Sighting Form
   - 8.5 Sightings Results Page
   - 8.6 Filters
9. Page Layout Descriptions
   - 9.1 Home Page Layout
   - 9.2 Lost Pet Form Layout
   - 9.3 Report a Sighting Form Layout
   - 9.4 Sightings Results Layout
10. Field Specifications
11. Matching Logic
12. Contact Privacy
13. Spam and Fake Reports
14. Data Expiry
15. Edge Cases
16. Error States
17. Confirmation Messages
18. Accessibility
19. Device Support
20. Performance
21. Browser Support
22. Success Criteria
23. What Can Wait Until Later
24. Glossary

---

## 1. Overview

Lost Pet Finder is a website that helps pet owners in one city find their missing pets faster. When a pet goes missing, the owner is usually panicking and does not know where to start looking. This site solves that problem by letting strangers report where they spotted a stray pet, and showing the owner exactly which streets to check.

The site has two sides: one for the person who lost a pet, and one for the stranger who spotted one. Both sides are fast and simple — no accounts, no complicated steps. The owner can submit a report, see matching sightings, and contact a stranger all without ever creating an account.

The site is built for one city only. It is in English. It works on phones, tablets, and computers. It was designed for a Grade 6 class project and uses only the four pages agreed on during planning.

---

## 2. Who is the site for?

### Primary User: The Pet Owner

The pet owner is the most important user on this site. They have just lost their pet — probably within the last hour — and they are scared and stressed. Every minute matters to them. They do not have time to read long instructions or fill out complicated forms.

The site must be fast, clear, and calm for this user. Every button should be obvious. Every message should be short. There should be no dead ends — the owner should always know what to do next. If something goes wrong, the error message should tell them exactly how to fix it, not just that something broke.

The owner is likely using their phone while walking around the neighborhood looking for their pet. The site must work well on a small phone screen with one hand.

### Secondary User: The Stranger

The stranger is someone walking around the city who spotted a stray pet on the street or in a park. They want to help but they are busy. They will only take a minute or two to report what they saw. If the form is too long or asks them to create an account, they will give up and walk away.

The site must make it as easy as possible for a stranger to report a sighting. No sign-up. No login. No long forms. Just the essential fields and done. The stranger does not need to understand how the whole site works — they just need to fill out one form and leave.

---

## 3. What problem does it solve?

When a pet goes missing, the owner usually has no idea where to search. They might walk around randomly, post on social media, or call neighbors — all of which take a lot of time and may not lead anywhere useful.

Lost Pet Finder solves this by connecting the owner directly to people who have already spotted a pet matching their description. Instead of searching the whole city, the owner can go straight to the streets where sightings were reported.

**The core problem:** The owner does not know where to search.

**The core solution:** Show the owner exactly where other people saw a pet like theirs, sorted by most recent, filtered by their pet's description.

**What makes this different from posting on social media:**
- Results are organized and filterable — not buried in a feed
- Strangers can report a sighting even if they do not follow the owner online
- Results expire after 3 days so the list stays fresh and relevant
- The owner sees only sightings that match their pet — not every stray in the city

---

## 4. Site Basics

| Detail | Decision |
|---|---|
| Site name | Lost Pet Finder |
| Language | English only |
| Location scope | One city only |
| Devices supported | Phones, tablets, and computers |
| Accounts required | No — anyone can use the site without signing up |
| Accessibility | Large text and high contrast mode supported |
| Photo on lost pet form | Optional — helps but is not required |
| Photo on sighting form | Optional — helps but is not required |
| Sighting expiry | Sighting reports removed automatically after 3 days |
| Lost pet report expiry | Does not expire — stays until owner removes it or marks as found |
| Max results shown | 20 most recent sightings per page |
| Filters | Color, size, gender, neighborhood — apply instantly |
| Contact privacy | Stranger's phone number hidden until owner clicks "Show contact" |

---

## 5. User Types

### Type 1: Pet Owner

- Has just lost a pet, usually within the past hour
- Is stressed, scared, and in a hurry
- Needs to know which streets to check
- Will fill out the Lost Pet Form
- Will view the Sightings Results Page
- May use filters to narrow down sightings
- May click "Show contact" to get a stranger's phone number
- May mark their pet as found when it is returned
- May edit or delete their report if needed

### Type 2: Stranger

- Has spotted a stray pet on the street, in a park, or near a building
- Wants to help but does not have much time
- Will fill out the Report a Sighting Form
- Does not need an account or login
- Will leave their phone number so the owner can contact them privately
- May see a confirmation that their sighting matched a lost pet

---

## 6. User Stories

### Pet Owner Stories

**Reporting a lost pet:**
- As a pet owner, I want to fill out a simple form so that strangers know what my pet looks like and where it was last seen.
- As a pet owner, I want the form to tell me which fields I missed so that I do not have to guess why it would not submit.
- As a pet owner, I want to add an optional photo so that strangers can recognize my pet more easily.
- As a pet owner, I want to get a confirmation after submitting so that I know my report was saved successfully.
- As a pet owner, I want to be taken straight to the results page after submitting so that I can see sightings immediately without extra clicks.

**Finding sightings:**
- As a pet owner, I want to see a list of sightings that match my pet's description so that I know which streets to check first.
- As a pet owner, I want to see the most recent sightings at the top so that I focus on the freshest leads and do not waste time on old ones.
- As a pet owner, I want to see a count of how many sightings were found so that I know how much information is available before I start reading.
- As a pet owner, I want to filter results by color, size, gender, and neighborhood so that I can narrow down the sightings quickly.
- As a pet owner, I want filters to apply instantly so that I do not have to click a search button every time I change a filter.
- As a pet owner, I want to clear all filters at once so that I can start over without refreshing the whole page.
- As a pet owner, I want to see a message when no sightings match my filters so that I know the list is empty on purpose, not broken.

**Contacting a stranger:**
- As a pet owner, I want the stranger's phone number to be hidden until I click a button so that their contact info is not shown to everyone who visits the page.
- As a pet owner, I want to call or text the stranger directly so that I can get more details about where they saw my pet.

**Managing my report:**
- As a pet owner, I want to edit my report if I made a mistake so that the information strangers see is accurate.
- As a pet owner, I want to delete my report if I no longer need help so that it does not stay on the site and mislead people.
- As a pet owner, I want to mark my pet as found so that my report is removed immediately and strangers stop looking.

**Help and tips:**
- As a pet owner, I want to read tips on what to do when a pet goes missing so that I do not miss any important steps while I wait for sightings to come in.

### Stranger Stories

**Reporting a sighting:**
- As a stranger, I want to report a sighting without creating an account so that I can help quickly and get back to what I was doing.
- As a stranger, I want to fill out a short form so that I am not delayed by too many questions.
- As a stranger, I want to add an optional photo so that the owner has a better chance of identifying their pet from my report.
- As a stranger, I want to know if my sighting matched a lost pet report so that I know my help was useful.
- As a stranger, I want to see a message if no match is found so that I know my report was still saved, even if no one has reported a matching lost pet yet.

**Privacy:**
- As a stranger, I want my phone number to stay hidden until the right owner clicks to reveal it so that random people cannot see my contact info.

---

## 7. User Flows

### Flow 1: Pet Owner Reports a Lost Pet and Views Sightings

1. Owner lands on the Home Page
2. Owner clicks "I lost a pet"
3. Owner is taken to the Lost Pet Form
4. Owner fills in: pet type, color, size, gender, last known street and city, contact info
5. Owner optionally adds a description and photo
6. Owner clicks Submit
7. Confirmation message appears: "Your report was saved."
8. Owner is automatically taken to the Sightings Results Page
9. Owner sees a count of matching sightings
10. Owner reads through sighting cards
11. Owner optionally applies filters to narrow down results
12. Owner clicks "Show contact" on a promising sighting
13. Owner calls or texts the stranger
14. (Later) Owner returns and clicks "Mark as found" when their pet is home

### Flow 2: Stranger Reports a Sighting

1. Stranger lands on the Home Page
2. Stranger clicks "I spotted a pet"
3. Stranger is taken to the Report a Sighting Form
4. Stranger fills in: pet type, color, size, gender, street and city where spotted, phone number
5. Stranger optionally adds a photo
6. Stranger clicks Submit
7. Site checks for matching lost pet reports
8a. If match found: stranger sees a message — "Your sighting may match a lost pet!"
8b. If no match: stranger sees — "No matches yet, but your report was saved."
9. Stranger leaves the site

### Flow 3: Owner Edits or Deletes Their Report

1. Owner returns to the site
2. Owner finds their report (via a link or saved page)
3. Owner clicks Edit
4. Owner updates the fields they want to change
5. Owner clicks Save
6. Confirmation: "Your report has been updated."

OR

3. Owner clicks Delete
4. Confirmation dialog: "Are you sure you want to delete this report?"
5. Owner confirms
6. Report is removed and owner sees: "Your report has been removed."

---

## 8. Page-by-Page Requirements

---

### 8.1 Home Page

**Purpose:** Give the user two clear paths — report a lost pet or report a sighting. The user should be able to decide and act within seconds of landing on this page.

**What is on this page:**
- The site name: Lost Pet Finder
- One short sentence that explains what the site does
  - Example: "Help your city find lost pets faster."
- Two large buttons placed prominently:
  - "I lost a pet" — links to the Lost Pet Form
  - "I spotted a pet" — links to the Report a Sighting Form
- A link to the Help Page in the header or footer

**Behavior:**
- Clicking "I lost a pet" takes the user directly to the Lost Pet Form with no intermediate steps
- Clicking "I spotted a pet" takes the user directly to the Report a Sighting Form with no intermediate steps
- The Help Page link opens the Help Page

**What this page does NOT have:**
- Login or sign-up prompt
- News feed, blog posts, or unrelated content
- Advertisements or promotional banners
- Long paragraphs of text
- Complex navigation menus

---

### 8.2 Help Page

**Purpose:** Give the pet owner calm, practical advice on what to do in the first few hours after a pet goes missing.

**What is on this page:**
- A short heading: "What to do when your pet goes missing"
- A numbered or bulleted list of tips
- Each tip is one or two short sentences
- Language is calm and reassuring — not alarming
- A link back to the Home Page

**Tips to include:**
1. Search your immediate street first — pets rarely go far in the first hour.
2. Ask neighbors to check their gardens, sheds, and garages.
3. Put a familiar-smelling item like a blanket or worn clothing outside your front door — it may help your pet find its way home.
4. Call local vets and animal shelters to report your pet missing.
5. Post on local community social media groups with a photo and your phone number.
6. Check back on Lost Pet Finder regularly — new sightings are added by people in your area.
7. Found your pet? Next time, put a tag with your phone number on their collar.

**Tip repeated on results page:**
- "Found your pet? Next time, put a tag with your phone number on their collar."

---

### 8.3 Lost Pet Form

**Purpose:** Collect enough information about the missing pet so that strangers can recognize it on the street and report a sighting that matches.

**Required fields:**
- Pet type (dropdown: Dog, Cat, Bird, Rabbit, Other)
- Color (text input)
- Size (dropdown: Small, Medium, Large)
- Gender (dropdown: Male, Female, Unknown)
- Last known street (text input)
- Last known city (text input)
- Owner contact info (text input — phone number or email)

**Optional fields:**
- Description in owner's own words (text area)
- Photo of the pet (file upload)

**Validation rules:**
- All required fields must be filled before the form can be submitted
- Contact info must match either a valid phone format or valid email format
- If a required field is empty on submit: show "This field is required" next to that field
- If contact info is in the wrong format: show "Please enter a valid phone number or email address"
- Photo file must be an image format (jpg, png, gif) if provided
- Description text area has a maximum of 300 characters

**After submitting:**
1. Confirmation message: "Your report was saved. We will show you sightings near your area."
2. User is taken automatically to the Sightings Results Page

**Owner controls (available after submitting):**
- Edit: Opens the form again with existing data pre-filled. Owner can change any field and save.
- Delete: Asks for confirmation, then permanently removes the report.
- Mark as found: Immediately removes the report and shows "Great news! We hope your pet is home safe."

---

### 8.4 Report a Sighting Form

**Purpose:** Let a stranger quickly report where they saw a stray pet so the owner can follow up directly.

**Required fields:**
- Pet type (dropdown: Dog, Cat, Bird, Rabbit, Other)
- Color (text input)
- Size (dropdown: Small, Medium, Large)
- Gender (dropdown: Male, Female, Unknown)
- Street where spotted (text input)
- City where spotted (text input)
- Stranger's phone number (text input — validated)

**Optional fields:**
- Photo of pet spotted (file upload)

**What this form does NOT have:**
- Free-text notes or comments field
- Sign-up or login requirement
- Breed field

**Validation rules:**
- All required fields must be filled before the form can be submitted
- Phone number must be in a valid format before the form can be submitted
- If a required field is empty: show "This field is required" next to that field
- If phone number is in the wrong format: show "Please enter a valid phone number"
- Photo file must be an image format (jpg, png, gif) if provided

**No account needed:**
- The form is open to anyone
- No email, username, or password is required

**After the stranger submits:**
- Site checks all active lost pet reports for a match on: pet type, color, size, gender, and city
- If one or more matches found:
  - Show the stranger the matching lost pet report(s)
  - Message at top: "Your sighting may match a lost pet! The owner can now see your report."
- If no match found:
  - Message: "No matches yet, but your report was saved. The owner will be able to see it."

---

### 8.5 Sightings Results Page

**Purpose:** Show the pet owner a clear, filtered list of nearby sightings that match their lost pet so they know exactly which streets to check.

**Page header:**
- Count: e.g. "5 sightings found near you"
- If no sightings at all: "No sightings yet. Check back soon."

**Sighting cards:**
Each sighting is displayed as a card. Cards are sorted most recent first. A maximum of 20 cards are shown.

Each card contains:
- Street and city where the pet was spotted
- Pet type, color, size, and gender
- Date and time the sighting was reported
- "Show contact" button — reveals the stranger's phone number when clicked
- "Report spam" button — flags the sighting as fake or unhelpful

Each card does NOT contain:
- The stranger's name
- The stranger's home address
- The stranger's phone number until "Show contact" is clicked

**Filters panel:**
- Located at the top or side of the results list
- Contains four filters: color, size, gender, neighborhood
- Filters apply instantly when changed — no submit button needed
- A "Clear all filters" button resets all filters at once

**Tip shown at the bottom:**
- "Found your pet? Next time, put a tag with your phone number on their collar."

**Expiry notice:**
- Sightings older than 3 days do not appear in the list — they are automatically removed

---

### 8.6 Filters

**Purpose:** Help the owner quickly narrow down sightings to only the ones that most closely match their pet.

**Filter: Color**
- Input type: Text field
- Owner types a color (e.g. "brown", "black and white")
- Only sightings with a matching color are shown

**Filter: Size**
- Input type: Dropdown
- Options: Small, Medium, Large, Any
- Default: Any (shows all sizes)

**Filter: Gender**
- Input type: Dropdown
- Options: Male, Female, Unknown, Any
- Default: Any (shows all genders)

**Filter: Neighborhood**
- Input type: Text field
- Owner types a neighborhood name
- Only sightings from that neighborhood are shown

**How all filters work together:**
- Filters are combined with AND logic — a sighting must match all active filters to appear
- Example: "Small + Brown + Male" shows only sightings where all three match
- Changing any filter instantly updates the list
- If no sightings match all active filters: "No sightings match your filters. Try adjusting them."
- Clicking "Clear all filters" resets everything and shows the full list again

---

## 9. Page Layout Descriptions

These are text descriptions of what each page looks like from top to bottom. No actual design work is included here — this is just to describe the structure.

### 9.1 Home Page Layout

```
[ Header: Lost Pet Finder ]
[ Tagline: "Help your city find lost pets faster." ]

[ Button: I lost a pet ]   [ Button: I spotted a pet ]

[ Footer: Link to Help Page ]
```

### 9.2 Lost Pet Form Layout

```
[ Heading: I Lost a Pet ]
[ Field: Pet type — dropdown ]
[ Field: Color — text ]
[ Field: Size — dropdown ]
[ Field: Gender — dropdown ]
[ Field: Description — text area (optional) ]
[ Field: Last known street — text ]
[ Field: Last known city — text ]
[ Field: Contact info — text ]
[ Field: Photo — file upload (optional) ]
[ Button: Submit ]
```

### 9.3 Report a Sighting Form Layout

```
[ Heading: I Spotted a Pet ]
[ Field: Pet type — dropdown ]
[ Field: Color — text ]
[ Field: Size — dropdown ]
[ Field: Gender — dropdown ]
[ Field: Street where spotted — text ]
[ Field: City where spotted — text ]
[ Field: Your phone number — text ]
[ Field: Photo — file upload (optional) ]
[ Button: Submit ]
```

### 9.4 Sightings Results Layout

```
[ Heading: Sightings Results ]
[ Count: "5 sightings found near you" ]

[ Filters: Color | Size | Gender | Neighborhood | Clear all ]

[ Card 1 — most recent ]
  Street and city | Pet type | Color | Size | Gender | Date and time
  [ Show contact ] [ Report spam ]

[ Card 2 ]
  ...

[ Card 3 ]
  ...

[ Tip: "Found your pet? Next time, put a tag with your phone number on their collar." ]
```

---

## 10. Field Specifications

This section defines the exact rules for each input field across all forms.

| Field | Form | Type | Required | Max length | Validation |
|---|---|---|---|---|---|
| Pet type | Both | Dropdown | Yes | N/A | Must select one option |
| Color | Both | Text | Yes | 50 characters | Not empty |
| Size | Both | Dropdown | Yes | N/A | Must select one option |
| Gender | Both | Dropdown | Yes | N/A | Must select one option |
| Description | Lost pet | Text area | No | 300 characters | None |
| Last known street | Lost pet | Text | Yes | 100 characters | Not empty |
| Last known city | Lost pet | Text | Yes | 100 characters | Not empty |
| Owner contact info | Lost pet | Text | Yes | 100 characters | Valid phone or email format |
| Photo | Both | File upload | No | 5 MB | Must be jpg, png, or gif |
| Street where spotted | Sighting | Text | Yes | 100 characters | Not empty |
| City where spotted | Sighting | Text | Yes | 100 characters | Not empty |
| Stranger phone number | Sighting | Text | Yes | 20 characters | Valid phone format |

---

## 11. Matching Logic

When a stranger submits a sighting, the site checks all active lost pet reports for a match. The following five fields are compared:

| Field compared | Rule |
|---|---|
| Pet type | Must be the same (e.g. Dog = Dog) |
| Color | Must be the same (e.g. Brown = Brown) |
| Size | Must be the same (e.g. Small = Small) |
| Gender | Must be the same, or one side is "Unknown" |
| City | Must be the same city |

**Full match:** All five fields match. The sighting is shown to the pet owner on their results page and the stranger is told their sighting matched.

**Partial match:** Some fields match but not all. The sighting is still saved and may appear in the owner's results but is ranked lower than full matches.

**No match:** No lost pet report matches the sighting. The sighting is saved. If a matching report is submitted later, the sighting will appear in those results.

**Gender unknown rule:** If either the sighting or the lost pet report lists gender as "Unknown," it is treated as a possible match and is shown in results.

---

## 12. Contact Privacy

Protecting the stranger's contact info is important. A stranger who reports a sighting is helping out of kindness. Their phone number must not be visible to everyone who visits the page.

**Rules:**
- The stranger's phone number is hidden by default on every sighting card
- A "Show contact" button appears on each card
- Clicking "Show contact" reveals the phone number on that card only
- The phone number is never shown in the page's public HTML without the owner clicking the button
- The stranger's name is never collected or shown anywhere on the site
- The stranger's home address is never collected or shown — a phone number is sufficient for contact

---

## 13. Spam and Fake Reports

Some people may submit fake sightings as a joke, by accident, or to test the site. The owner needs a way to flag these so the results stay trustworthy.

**Rules:**
- Every sighting card has a "Report spam" button
- When the owner clicks "Report spam," the sighting is flagged in the system
- Flagged sightings can be reviewed and removed
- The stranger who submitted the sighting is not notified that it was flagged
- Multiple spam reports on the same sighting increase its priority for removal
- Spam reporting does not require the owner to explain why — one click is enough

---

## 14. Data Expiry

Sighting reports become less useful as time passes. A sighting from 4 days ago is very unlikely to help the owner find their pet today.

**Sighting reports:**
- Automatically removed after 3 days from the time they were submitted
- Not shown in results after they expire, even if they matched the lost pet
- The owner is not notified when a sighting expires
- Photos attached to expired sightings are also removed

**Lost pet reports:**
- Do NOT expire automatically
- Stay on the site until the owner deletes the report or marks their pet as found
- Owner is responsible for removing the report once their pet is returned

---

## 15. Edge Cases

These are unusual situations the site must handle correctly.

| Situation | What the site should do |
|---|---|
| Owner submits form but has no photo | Form submits normally — photo is optional |
| Stranger submits form but no lost pet report matches | Save the sighting and show "No matches yet" message |
| Owner marks pet as found and comes back to the results page | Show a message: "You have already marked this pet as found." |
| Two sightings are submitted at the exact same time | Both are saved and shown in results — sorted by timestamp |
| A sighting expires while the owner is viewing the results page | The expired card disappears on the next page load |
| Owner tries to submit the lost pet form with an empty required field | Show error next to each empty field — do not submit |
| Stranger enters a phone number with spaces or dashes | Accept it if the format is valid after stripping spaces and dashes |
| Owner applies all four filters and nothing matches | Show: "No sightings match your filters. Try adjusting them." |
| Owner clicks "Show contact" on two different sighting cards | Both phone numbers are revealed — they do not hide each other |
| Owner tries to delete their report after marking pet as found | Report is already gone — show: "This report no longer exists." |

---

## 16. Error States

The site must handle mistakes clearly and kindly. Error messages must be short, visible, and tell the user exactly what to fix.

| Situation | Message shown | Where it appears |
|---|---|---|
| Required field left empty | "This field is required" | Next to the empty field |
| Phone number in wrong format | "Please enter a valid phone number" | Next to the phone field |
| Email in wrong format | "Please enter a valid email address" | Next to the contact field |
| Photo file is wrong type | "Please upload a jpg, png, or gif file" | Next to the photo field |
| Photo file is too large | "Photo must be under 5 MB" | Next to the photo field |
| No sightings match the lost pet | "No sightings yet. Check back soon." | Center of results area |
| No sightings match active filters | "No sightings match your filters. Try adjusting them." | Center of results area |
| Page fails to load | "Something went wrong. Please try again." | Center of page |
| Sighting submitted but no match | "No matches yet, but your report was saved." | Top of page after submit |
| Owner tries to access deleted report | "This report no longer exists." | Center of page |

---

## 17. Confirmation Messages

Confirmation messages reassure the user that their action worked. They appear immediately after the action is completed.

| Action | Confirmation message |
|---|---|
| Lost pet form submitted | "Your report was saved. We will show you sightings near your area." |
| Sighting submitted with a match | "Your sighting may match a lost pet! The owner can now see your report." |
| Sighting submitted with no match | "No matches yet, but your report was saved. The owner will be able to see it." |
| Lost pet report edited and saved | "Your report has been updated." |
| Lost pet report deleted | "Your report has been removed." |
| Pet marked as found | "Great news! We hope your pet is home safe." |
| Spam report submitted | "Thank you. This sighting has been flagged for review." |
| "Show contact" clicked | The phone number appears — no separate message needed |

---

## 18. Accessibility

The site must be usable by people with different needs, including people who have difficulty reading small text, people who cannot use a mouse, and people who need high contrast to see clearly.

**Text size:**
- A large text option allows users to increase the font size throughout the site
- Default text size must be readable without zooming on a standard phone screen

**Color contrast:**
- High contrast mode available — switches the color scheme to dark background with bright text or vice versa
- In normal mode, all text must have sufficient contrast against its background

**Buttons and tap targets:**
- All buttons must be large enough to tap easily on a small phone screen
- Minimum button height: 44 pixels (standard mobile tap target size)
- Buttons must have clear labels — no icon-only buttons

**Images:**
- All photos uploaded by users must have an alt text placeholder
- The site must not break if a photo fails to load

**Keyboard navigation:**
- The entire site must be usable with only a keyboard — no mouse required
- Tab key must move through form fields in a logical order
- Enter key must activate buttons and submit forms

**Error messages:**
- Error messages must be clearly visible — not faint or hidden
- Error messages must appear next to the field they relate to, not only at the top of the page

**Screen readers:**
- All form fields must have labels that screen readers can read
- Buttons must have descriptive text (e.g. "Submit lost pet report" not just "Submit")

---

## 19. Device Support

The site must work correctly on any device the user happens to have in their hand when their pet goes missing.

| Device | Supported |
|---|---|
| Mobile phone (small screen) | Yes |
| Tablet | Yes |
| Laptop | Yes |
| Desktop computer | Yes |

**Responsive layout rules:**
- On a small phone screen: buttons are full width and easy to tap. One column layout.
- On a tablet: buttons are wider but not full screen. Layout may use two columns.
- On a laptop or desktop: layout can use more horizontal space. Filters may appear beside the results list.

---

## 20. Performance

The site must load quickly because the pet owner is in a hurry.

| Requirement | Target |
|---|---|
| Home page load time | Under 2 seconds on a standard phone connection |
| Form submit and redirect | Under 3 seconds |
| Filter update (no page reload) | Under 1 second |
| Results page initial load | Under 3 seconds |

Photos should be compressed before being stored so they do not slow down the page.

---

## 21. Browser Support

The site must work correctly in the most common browsers.

| Browser | Supported |
|---|---|
| Google Chrome | Yes |
| Safari (iPhone) | Yes |
| Firefox | Yes |
| Microsoft Edge | Yes |

The site does not need to support very old browsers or Internet Explorer.

---

## 22. Success Criteria

The site is ready to demo when all of the following are true:

1. A pet owner can submit a lost pet report in under 2 minutes
2. A stranger can report a sighting without creating an account
3. The results page correctly shows sightings that match the lost pet's color, size, gender, and pet type
4. The count at the top of the results page shows the correct number of matching sightings
5. The stranger's phone number is hidden by default and only revealed when the owner clicks "Show contact"
6. All four filters (color, size, gender, neighborhood) work correctly on the results page
7. Filters apply instantly without a search button
8. If no sightings match the active filters, a clear message is shown
9. Sightings older than 3 days are automatically removed and no longer shown
10. The owner can mark their pet as found and the report disappears immediately
11. The owner can edit their report and see a confirmation that it was updated
12. The owner can delete their report and see a confirmation that it was removed
13. All required fields show an individual error message if left empty on submit
14. The phone number field on the sighting form validates the format before submitting
15. The site works correctly on a phone screen and on a computer screen
16. Large text mode and high contrast mode are both available and working
17. The Help Page shows all tips and is reachable from the Home Page
18. The "Report spam" button appears on every sighting card and flags the sighting when clicked
19. Photos are optional on both forms — the forms submit successfully without a photo
20. A confirmation message appears after every major action (submit, edit, delete, mark as found)

---

## 23. What Can Wait Until Later?

These features were discussed during planning but are not needed for the first version of the site. They can be added in a future version.

| Feature | Reason it was cut |
|---|---|
| User accounts and login | Adds complexity; strangers need to report fast without signing up |
| Map view of sightings | Requires a map service like Google Maps — a plain text list is faster to build and just as useful |
| Automatic notifications | Requires a backend email or text message service — too complex for this version |
| Breed field on forms | Too hard to answer in a panic; color and size are enough to identify a pet |
| Multiple languages | English only for this version |
| Multiple cities | One city only for this version |
| Date filter on results page | Not needed — the 3-day expiry keeps results fresh automatically |
| Live chat between owner and stranger | Direct phone contact is faster and simpler |
| Stranger's home address | Safety risk — a phone number is safer and gives the owner enough to follow up |
| Automatic matching notifications | Would require the site to send texts or emails — out of scope for this build |
| Saved searches | Not needed — owner visits the results page directly after submitting |

---

## 24. Glossary

| Term | Definition |
|---|---|
| Pet owner | The person who lost a pet and is using the site to find it |
| Stranger | A person who spotted a stray pet and is reporting a sighting |
| Sighting | A report submitted by a stranger describing a pet they saw on the street |
| Lost pet report | A report submitted by the owner describing their missing pet |
| Match | When a sighting's pet type, color, size, gender, and city all match a lost pet report |
| Results page | The Sightings Results Page — shows the owner a list of sightings that match their pet |
| Show contact | A button on each sighting card that reveals the stranger's phone number |
| Report spam | A button that flags a sighting as fake or unhelpful |
| Mark as found | A button that removes the owner's lost pet report because the pet has been returned |
| Expiry | The automatic removal of a sighting report after 3 days |
| Filters | Controls that let the owner narrow down sightings by color, size, gender, or neighborhood |
| Confirmation message | A short message that tells the user their action was completed successfully |
| Error message | A short message that tells the user something went wrong and how to fix it |
| Validation | Checking that a field contains the correct type of information before the form submits |
| Optional field | A field that does not need to be filled in for the form to submit |
| Required field | A field that must be filled in before the form can be submitted |
