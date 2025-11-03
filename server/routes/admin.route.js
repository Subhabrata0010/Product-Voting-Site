const { Router } = require("express");
const { createAccount, adminLogin, getAdmin, getAccessToken, adminLogout } = require("../controllers/admin.controller");
const authenticateAdmin = require("../middleware/auth.middleware");

const adminRouter = Router();

adminRouter.post('/admin/signup', createAccount);
adminRouter.post('/admin/login', adminLogin);
adminRouter.post('/admin/logout', authenticateAdmin, adminLogout);
adminRouter.get('/admin/getadmin', authenticateAdmin, getAdmin);
adminRouter.get('/admin/getaccesstoken', getAccessToken);

module.exports = adminRouter;