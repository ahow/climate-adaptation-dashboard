# Climate Adaptation Dashboard - TODO

## Current Issue
- [x] Fix project initialization error - project_id not found

## Features to Implement

### Phase 1: Data Preparation
- [x] Prepare activities data JSON with sample activities
- [x] Prepare company data JSON with avoided loss estimates
- [x] Prepare segment mapping data

### Phase 2: Core Dashboard
- [x] Create main dashboard layout
- [x] Build activities list view with search/filter
- [x] Build activity detail view with assumptions table
- [x] Implement editable assumptions with real-time calculation
- [x] Build company list view

### Phase 3: Advanced Features
- [x] Add segment mapping display
- [x] Implement Excel export functionality (CSV)
- [ ] Add data visualization charts
- [x] Create user guide/documentation (About tab)

### Phase 4: Testing & Deployment
- [x] Test all calculations
- [x] Test Excel export
- [ ] Expand to include all 80+ activities from comprehensive framework
- [ ] Save checkpoint
- [ ] Deploy dashboard



## Bugs to Fix
- [ ] Fix project_id error preventing publication - need to properly configure webdev project structure




## Deployment
- [x] Deploy dashboard to Heroku
- [x] Verify public access




## Dashboard Expansion
- [ ] Extract all 80+ activities from comprehensive framework
- [ ] Import complete FactSet company database (~1,600 companies)
- [ ] Add all company-activity mappings with segment details
- [ ] Make value chain attribution percentages editable
- [ ] Update data preparation scripts
- [ ] Redeploy to Heroku with expanded data
- [ ] Verify all activities and companies display correctly




## Current Sprint - Complete Activity Integration
- [x] Extract complete detailed list of all 61 activities with full metadata
- [x] Create properly structured activities JSON matching dashboard schema
- [x] Replace sample companies.json with 1,627 real companies
- [x] Update CompaniesList component to handle large dataset with pagination
- [x] Build production version with complete data
- [x] Deploy to Heroku
- [x] Verify all data displays correctly - All 61 activities and 1,627 companies loading successfully




## Bugs to Fix
- [ ] Fix blank page issue when clicking on activities in the dashboard
- [ ] Investigate console errors and activity detail component
- [ ] Ensure all 61 activities display correctly when selected


