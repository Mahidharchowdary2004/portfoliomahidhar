# Deployment Rollback Strategy and Procedures

## Overview
This document outlines the rollback strategy and step-by-step procedures for reverting deployments in case of critical failures for the Mahidhar Portfolio project.

## Deployment Architecture
- **Frontend**: https://portfoliomahidhar.onrender.com (React SPA on Render.com)
- **Backend**: https://portfoliomahidhar-backend.onrender.com (Express API on Render.com) 
- **Database**: MongoDB Atlas (Cloud-hosted)

## Rollback Triggers

### Critical Failure Conditions
Execute immediate rollback when:
- [ ] Frontend returns 500/503 errors consistently (>90% of requests)
- [ ] Admin panel completely inaccessible for >10 minutes
- [ ] Backend API down with 500+ errors for >5 minutes
- [ ] Database connection failures preventing all data operations
- [ ] Security breach or authentication system compromise
- [ ] Data corruption or loss detected

### Warning Conditions (Monitor but don't rollback immediately)
- Response times >10 seconds
- Intermittent 404 errors on specific routes
- Non-critical features broken
- UI display issues that don't affect functionality

## Rollback Procedures

### 1. Frontend Rollback (Render.com)

#### Method A: Render Dashboard Rollback
1. **Access Render Dashboard**
   - Go to https://dashboard.render.com
   - Navigate to your frontend service
   - Click on "Deploys" tab

2. **Identify Last Known Good Deployment**
   - Review deployment history
   - Look for the last successful deployment before issues
   - Note the commit hash and timestamp

3. **Execute Rollback**
   ```bash
   # In Render dashboard:
   # 1. Click on the last good deployment
   # 2. Click "Redeploy" button
   # 3. Confirm rollback action
   ```

4. **Verify Rollback**
   - Wait 3-5 minutes for deployment completion
   - Test https://portfoliomahidhar.onrender.com
   - Verify admin panel: https://portfoliomahidhar.onrender.com/admin

#### Method B: Git-based Rollback
```bash
# 1. Identify the last working commit
git log --oneline -10

# 2. Create a revert commit (recommended)
git revert <bad-commit-hash>
git push origin main

# 3. OR force reset to previous commit (use with caution)
git reset --hard <last-good-commit-hash>
git push --force origin main

# 4. Trigger redeploy in Render dashboard
```

### 2. Backend Rollback (Render.com)

#### Method A: Render Dashboard Rollback
1. **Access Backend Service**
   - Go to https://dashboard.render.com
   - Navigate to backend service
   - Click "Deploys" tab

2. **Rollback Process**
   - Select last working deployment
   - Click "Redeploy"
   - Monitor deployment logs

3. **Verify Backend**
   ```bash
   # Test critical endpoints
   curl https://portfoliomahidhar-backend.onrender.com/skills
   curl https://portfoliomahidhar-backend.onrender.com/projects
   curl https://portfoliomahidhar-backend.onrender.com/contact-info
   ```

#### Method B: Environment Rollback
```bash
# 1. Check environment variables in Render dashboard
# 2. Restore previous MongoDB connection string if changed
# 3. Verify API authentication token settings
# 4. Redeploy with restored settings
```

### 3. Database Rollback (MongoDB Atlas)

#### Backup Restoration
1. **Access MongoDB Atlas**
   - Login to https://cloud.mongodb.com
   - Navigate to your cluster
   - Go to "Backup" section

2. **Restore from Backup**
   ```bash
   # In Atlas dashboard:
   # 1. Select backup timestamp before issues
   # 2. Choose restore method:
   #    - Restore to same cluster (overwrites data)
   #    - Restore to new cluster (safer option)
   # 3. Confirm restoration
   ```

3. **Update Connection String** (if restored to new cluster)
   ```bash
   # Update backend environment variables
   MONGODB_URI=<new-cluster-connection-string>
   
   # Redeploy backend with new connection string
   ```

### 4. Full System Rollback

#### Emergency Complete Rollback
```bash
# 1. Simultaneously rollback frontend and backend
# 2. Use git to revert to last known good state
git checkout <last-good-commit>
git checkout -b emergency-rollback
git push origin emergency-rollback

# 3. Deploy emergency branch to both services
# 4. Update Render to deploy from emergency-rollback branch
```

## Rollback Validation

### Post-Rollback Checklist
After executing rollback, verify:

#### Frontend Validation
- [ ] Website loads at https://portfoliomahidhar.onrender.com
- [ ] All sections display correctly
- [ ] Navigation works properly
- [ ] Admin panel accessible at /admin
- [ ] Login functionality works
- [ ] No console errors in browser

#### Backend Validation
- [ ] All API endpoints return 200 status
- [ ] Authentication works with token `mahi@123`
- [ ] Data retrieval functions correctly
- [ ] Admin operations work (PUT requests)
- [ ] CORS headers present
- [ ] Database connectivity confirmed

#### Database Validation
- [ ] Data integrity maintained
- [ ] All collections accessible
- [ ] Read/write operations functional
- [ ] No data corruption detected
- [ ] Backup scheduled properly

### Performance Validation
- [ ] Frontend loads under 3 seconds
- [ ] API responses under 1 second
- [ ] Admin panel operations under 2 seconds
- [ ] No memory leaks or resource issues

## Communication Plan

### Internal Communication
1. **Immediate Alert** (within 2 minutes)
   - Document the failure condition
   - Record timestamp and symptoms
   - Note rollback decision reasoning

2. **Progress Updates** (every 15 minutes during rollback)
   - Current rollback status
   - Estimated completion time
   - Any issues encountered

3. **Completion Report** (within 30 minutes of completion)
   - Rollback success confirmation
   - Root cause analysis
   - Prevention measures

### External Communication
- **User Notification**: If rollback takes >30 minutes, consider user communication
- **Status Page**: Update if available
- **Social Media**: Only for extended outages

## Prevention Measures

### Pre-Deployment Checks
```bash
# Before any deployment, run:
# 1. Test build locally
npm run build

# 2. Test admin functionality
# - Verify login works
# - Test data updates
# - Check API connectivity

# 3. Database backup
# - Ensure recent backup exists
# - Verify backup integrity

# 4. Staging deployment (if available)
# - Deploy to staging first
# - Run full functional tests
# - Verify with team before production
```

### Deployment Best Practices
1. **Deploy during low-traffic periods**
2. **Always have database backup before deployment**
3. **Test critical paths before announcing deployment**
4. **Monitor for 30 minutes post-deployment**
5. **Keep rollback instructions readily available**

## Recovery Time Objectives (RTO)

### Target Recovery Times
- **Frontend Rollback**: 5-10 minutes
- **Backend Rollback**: 10-15 minutes  
- **Database Rollback**: 15-30 minutes
- **Full System Rollback**: 20-45 minutes

### Factors Affecting Recovery Time
- Render.com deployment queue
- Database backup size
- Network connectivity
- Complexity of changes being reverted

## Testing Rollback Procedures

### Quarterly Rollback Drills
1. **Schedule**: Every 3 months
2. **Scope**: Practice rollback on staging environment
3. **Document**: Time taken, issues encountered
4. **Improve**: Update procedures based on learnings

### Rollback Testing Checklist
- [ ] Frontend rollback procedure tested
- [ ] Backend rollback procedure tested  
- [ ] Database restoration tested
- [ ] Communication plan tested
- [ ] Documentation updated
- [ ] Team trained on procedures

## Emergency Contacts

### Technical Contacts
- **Primary**: Project maintainer
- **Secondary**: Backend developer
- **Database**: MongoDB Atlas support

### Service Contacts
- **Render.com**: https://render.com/docs/support
- **MongoDB Atlas**: https://support.mongodb.com
- **Domain Provider**: (if applicable)

## Rollback Log Template

```
Date: ___________
Time Started: ___________
Time Completed: ___________
Trigger Condition: ___________
Rollback Method: ___________
Services Affected: 
  - Frontend: [ ] Yes [ ] No
  - Backend: [ ] Yes [ ] No  
  - Database: [ ] Yes [ ] No
Root Cause: ___________
Success: [ ] Yes [ ] No
Issues Encountered: ___________
Lessons Learned: ___________
```

## Version History
- **v1.0**: Initial rollback strategy created
- **v1.1**: Added specific Render.com procedures
- **v1.2**: Enhanced database rollback procedures

---

**Important**: Keep this document accessible during deployments and ensure all team members know its location.