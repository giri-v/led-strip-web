const router = require("express").Router();
const logger = require("../../logger");
const { sp108e } = require("sp108e_raw");

//const remoteRoutes = require("./sites");

//router.use("/sites", remoteRoutes);

const sp108e_options = [
    {
        host: "192.168.5.114",
        port: 8189
    }
];

var controllers = [];


    initController();


async function initController() {
    console.log("Running initController!!!");
    for (i = 0; i <= sp108e_options.length - 1; i++) {
        const ctl = new sp108e(sp108e_options[i]);
        controllers.push(ctl);
        console.log("Getting status for " + sp108e_options[i].host);
        const statResp = await ctl.getStatus();
        const nameResp = await ctl.getName();
    }
}

console.log("Created " + controllers.length + " sp108e controllers.");

const serveApp = (req, res, next) => {
    setQueryParams(req);
};

async function setQueryParams (req) {

    console.log("XxX   ---   " + req.path.substring(1));
    for (i = 0; i <= controllers.length - 1; i++) {
        var ctl = controllers[i];
        console.log(ctl.name);
        if (ctl.name == "SP108E_" + req.path.substring(1)) {
            found = true;
            console.log(req.query);
            for (key in req.query) {
                var val = req.query[key];
                console.log("Setting " + key + " = " + val);
                switch (key) {
                    case "brightness": await ctl.setBrightness(val);
                    case "color": await ctl.setColor(val)
                }
            }
        }
    }
}

router.use(serveApp);



module.exports = router;
