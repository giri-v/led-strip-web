const router = require("express").Router();
const logger = require("../../logger");
const { sp108e, A } = require("sp108e_raw");

//const remoteRoutes = require("./sites");

//router.use("/sites", remoteRoutes);

const sp108e_options = [
    {
        host: "192.168.5.114",
        port: 8189
    },
    {
        host: "192.168.5.115",
        port: 8189
    }
];

var controllers = [];
var cNames = [];


initController();


async function initController() {
    console.log("Running initController!!!");
    for (i = 0; i <= sp108e_options.length - 1; i++) {
        const ctl = new sp108e(sp108e_options[i]);
        controllers.push(ctl);
        console.log("Getting status for " + sp108e_options[i].host);
        const statResp = await ctl.getStatus();
        var nameResp = "";
        if (ctl.status.result == "OK") {
            nameResp = await ctl.getName();
            cNames.push(nameResp.substring(7));
        }
    }
}

console.log("Created " + controllers.length + " sp108e controllers.");

const serveApp = (req, res, next) => {
    if (req.path.substring(1) == "ListControllers") {
        // return JSON of controller Names
        res.send(JSON.stringify(cNames));
    }
    else
        setQueryParams(req);
};

async function setQueryParams(req) {

    //console.log("XxX   ---   " + req.path.substring(1));
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
                    case "brightness": await ctl.setBrightness(val); break;
                    case "color": await ctl.setColor(val); break;
                    case "speed": await ctl.setAnimationSpeed(val); break;
                    case "dreammode": await ctl.setDreamMode(val); break;
                    case "next": await ctl.nextDreamMode(); break;
                    case "prev": await ctl.prevDreamMode(); break;
                    case "toggle": await ctl.toggleOnOff(); break;
                    case "on": await ctl.on(); break;
                    case "off": await ctl.off(); break;
                    case "static": await ctl.setAnimationMode(ANIM_MODE_STATIC); break;
                }
            }
        }
    }
}

router.use(serveApp);



module.exports = router;
