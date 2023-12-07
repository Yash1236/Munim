const { is_development, node_url } = require('./config');
const { encrypt_decrypt_str, robotDiv } = require('./common_functions');
const puppeteer = require("puppeteer");
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
let browser = '';
let page = '';
let user_data = '';

const handleGstPuppeteer = async (userData, BrowserView, mainWindow, screen) => {
    try {
        const { width, height } = screen.getPrimaryDisplay().bounds;
        userData.username = encrypt_decrypt_str(userData.username, false)
        userData.password = encrypt_decrypt_str(userData.password, false)
        const launchOptions = {
            devtools: true,
            headless: false,
            args: ['--app=https://services.gst.gov.in/services/login', "--no-sandbox", "--disable-setuid-sandbox", '--disable-gpu', '--devtools-flags=disable', '--start-maximized'],
            ignoreHTTPSErrors: true,
            defaultViewport: { width: width, height: height - 100 },
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        };
        browser = await puppeteer.launch(launchOptions);

        [page] = await browser.pages();
        page.waitForTimeout(2000)
        await page.waitForSelector('[id="username"]');
        await page.type('[id="username"]', userData.username);

        await page.waitForSelector('[id="user_pass"]');
        await page.type('[id="user_pass"]', userData.password);

        let get_new_div = robotDiv('Please Enter the Captcha and Press Login Button');
        await page.evaluate((get_new_div) => {
            let get_exsting_html = document.querySelector("div[data-ng-controller='headerCtrl'").outerHTML;
            document.querySelector("div[data-ng-controller='headerCtrl'").outerHTML = get_new_div + get_exsting_html;
            document.getElementById("captcha").style.border = "thick solid #f89c0c";
            document.getElementById("captcha").focus();
            document.querySelector("button[data-ng-bind='trans.HEAD_LOGIN'").style.border = "thick solid #f89c0c";
        }, get_new_div);

        const login_timer = setInterval(() => {
            if (!page.url().includes('login')) {
                if (userData.filling_type == 4) {
                    nillReturnAfterLogIn(userData)
                } else {
                    handleGstAfterLogIn(userData, 2)
                }
                clearInterval(login_timer)
            }
        }, 100);
    } catch (error) {
        console.log("handleGstPuppeteer---------------", error);
        catchErrorHandle(userData, error.stack, 'handleGstPuppeteer');
        sendReturnSuccessId(userData, '', 2);
    }
}

/**
 * IW0079
 * This function called when user try to open gst portal from company list
 */
const handleGstPortalFromList = async (userData, BrowserView, mainWindow, screen) => {
    try {
        const { width, height } = screen.getPrimaryDisplay().bounds;
        const launchOptions = {
            devtools: true,
            headless: false,
            args: ['--app=https://services.gst.gov.in/services/login', "--no-sandbox", "--disable-setuid-sandbox", '--disable-gpu', '--devtools-flags=disable', '--start-maximized'],
            ignoreHTTPSErrors: true,
            defaultViewport: { width: width, height: height - 100 },
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        };
        browser = await puppeteer.launch(launchOptions);

        [page] = await browser.pages();
        page.waitForTimeout(2000)
        await page.waitForSelector('[id="username"]');
        await page.type('[id="username"]', userData.username);

        await page.waitForSelector('[id="user_pass"]');
        await page.type('[id="user_pass"]', userData.password);
        await page.type('[id="captcha"]', '');

    } catch (error) {
        console.log("handleGstPortalFromList---------------", error);
    }
}
async function launchGstApp(redirectOn = '', BrowserView, mainWindow, screen) {
    try {
        let webView = ''
        if (redirectOn !== 'gst' && redirectOn !== 'gst_verify') {
            webView = new BrowserView({
                webPreferences: {
                    preload: path.join(__dirname, 'webPreload.js'),
                }
            });
            mainWindow.setBrowserView(webView);
            mainWindow.maximize();
            const { width, height } = screen.getPrimaryDisplay().bounds;
            webView.setBounds({ x: 0, y: 0, width: width, height: height - 100 });
            if (is_development) {
                webView.webContents.openDevTools();
            }
            webView.webContents.loadURL(redirectOn);
            webView.webContents.on('page-title-updated', () => {
                webView.webContents.executeJavaScript(`
        localStorageData = JSON.stringify(localStorage.getItem('userData'));
        `).then((localStorageData) => {
                    // Handle the localStorage data received from the webview
                    // console.log('localStorage data=>>>>>>>>>>>>>', localStorageData);
                }).catch((error) => {
                    console.error('Failed to retrieve localStorage data:', error);
                });
            });
        } else {
            handleGstPuppeteer(redirectOn, BrowserView, mainWindow, screen)
        }
    } catch (error) {
        console.log("launchGstApp-----------", error);
    }
}

async function handleGstResetAllData(userData) {
    try {
        /** click on reset data */
        await page.evaluate(() => {
            if (document.querySelector("button[data-ng-click='popUpReset()']")) {
                document.querySelector("button[data-ng-click='popUpReset()']").click();
            }
        });
        await page.waitForSelector("a[ng-click='callback()']", { visible: true });
        /** click on confirmation button */
        await page.click("a[ng-click='callback()']");
        await page.waitForSelector(".dimmer-holder", { hidden: true })
        /** click on refresh button */
        await page.click('.btn.btn-primary.btn-circle.btn-sm.pull-right')
        await updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" }, true);
        await browser.close()
    } catch (error) {
        console.log('handleGstResetAllData========>', error)
        catchErrorHandle(userData, error.stack, 'handleGstResetAllData');
        updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" });
    }
}
async function updateUserPanDetail(userData, pan_data) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://munimdesktop.com',
                'origin': 'http://munimdesktop.com',
                'access-token': userData.access_token
            }
        };
        let data = {
            id: userData.company_id,
            auth_pan_no: JSON.stringify(pan_data)
        };
        await axios.post(`${node_url}/set-authorised_pan`, data, config).catch(error => {
            console.log("error===========", error);
        });
        await browser.close()
        return { success_fully_logged_in: true }
    } catch (error) {
        console.log("updateUserPanDetail------------------", error);
        catchErrorHandle(userData, error.stack, 'updateUserPanDetail');
        await browser.close()
        return { success_fully_logged_in: true }
    }
}
async function getPanDetailForMunim(userData) {
    try {
        await page.waitForSelector(".dimmer-holder", { hidden: true })
        /** handle click on Amendment of Registration Non - Core Fields */
        await page.evaluate(() => {
            if (document.querySelector('a[href="//reg.gst.gov.in/registration/auth/amend/noncore/business')) {
                document.querySelector('a[href="//reg.gst.gov.in/registration/auth/amend/noncore/business').click();
            }
        });
        await page.waitForSelector(".dimmer-holder", { visible: true })
        await page.waitForSelector(".dimmer-holder", { hidden: true })
        /** handle click on My saved application */
        await page.evaluate(() => {
            if (document.querySelector('a[href="//services.gst.gov.in/services/auth/savedapp"]')) {
                document.querySelector('a[href="//services.gst.gov.in/services/auth/savedapp"]').click();
            }
        });
        await page.waitForSelector(".btn.btn-sm.btn-primary", { visible: true })
        /** handle click on edit in first My saved application */
        await page.evaluate(() => {
            if (document.querySelector('.btn.btn-sm.btn-primary')) {
                document.querySelector('.btn.btn-sm.btn-primary').click();
            }
        });
        await page.waitForSelector(".dimmer-holder", { visible: true })
        await page.waitForSelector(".dimmer-holder", { hidden: true })
        /** handle click on Authorized signatory */
        await page.evaluate(() => {
            if (document.querySelector('a[data-ng-click="tabroute(3)"]')) {
                document.querySelector('a[data-ng-click="tabroute(3)"]').click();
            }
        });
        await page.waitForSelector(".dimmer-holder", { visible: true })
        await page.waitForSelector(".dimmer-holder", { hidden: true })
        /** first get all data and then get separate details of each one */
        const all_user_detail = await page.evaluate(async () => {
            const total_data = document.querySelectorAll('tr td div button.btn.btn-sm.btn-primary').length
            // Define a function to get user details and return a promise
            function getUserData(index) {
                return new Promise((resolve, reject) => {
                    document.querySelectorAll('tr td div button.btn.btn-sm.btn-primary')[index].click()
                    const pan_no = document.querySelector('p[data-ng-if="!panEnable"]').innerHTML
                    const fname = document.getElementById('as_fname').value
                    const mname = document.getElementById('as_mname').value
                    const lname = document.getElementById('as_lname').value
                    const mobile_no = document.getElementById('as_mobile').value
                    document.querySelector('button[title="Cancel"]').click()
                    resolve({
                        auth_pan_no: pan_no,
                        auth_pan_name: `${fname} ${mname} ${lname}`,
                        mobile_no,
                        last_used: false
                    });
                });
            }

            // Perform the steps sequentially using async/await
            async function performSteps() {
                const users_pan_detail = []
                for (let i = 0; i < total_data; i++) {
                    const final_user_data = await getUserData(i);
                    users_pan_detail.push(final_user_data)
                }
                return users_pan_detail;
            }
            const final_data = await performSteps();
            return final_data
        });
        return await updateUserPanDetail(userData, all_user_detail)
    } catch (error) {
        console.log("getPanDetailForMunim----------------", error)
        catchErrorHandle(userData, error.stack, 'getPanDetailForMunim');
        return { success_fully_logged_in: true }
    }
}
/**process 1 for upload gst data, 
 * process 2 for file with evc,
 * process 3 for download error file, 
 * process 4 for re-generate summary,
 * process 5 for Reset data
 */
async function handleGstAfterLogIn(userData, process) {
    try {
        /** handle pop up after login */
        // await page.waitForSelector(".dimmer-holder", { hidden: true })
        if (page.url() === 'https://services.gst.gov.in/services/auth/fowelcome') {
            await page.evaluate(() => {
                if (document.querySelector('#adhrtableV .btn.btn-primary[data-dismiss]')) {
                    document.querySelector('#adhrtableV .btn.btn-primary[data-dismiss]').click()
                }
            });
        }
        /** click on return dashboard button after login */
        await page.evaluate(() => {
            if (document.querySelectorAll('.btn.btn-primary.pad-l-50.pad-r-50')[0]) {
                document.querySelectorAll('.btn.btn-primary.pad-l-50.pad-r-50')[0].click();
            }
        });
        await page.waitForSelector(".dimmer-holder", { visible: true })
        await page.waitForSelector(".dimmer-holder", { hidden: true })
        /** select date period for fill gstr1 */
        await handleReturnSelectionPeriod(userData)
        await page.waitForSelector(".dimmer-holder", { visible: true })
        await page.waitForSelector(".dimmer-holder", { hidden: true })
        if ([1, 3].includes(process)) {
            /** click on prepare offline after search click */
            await page.evaluate(() => {
                if (document.querySelectorAll('.btn.btn-primary.smallbutton')[1]) {
                    document.querySelectorAll('.btn.btn-primary.smallbutton')[1].click();
                }
            });
            await page.waitForSelector(".dimmer-holder", { hidden: true })
            if (process === 1) {
                /** get json data from database */
                const response = await getUploadedJsonData(userData);
                await page.waitForSelector(".dimmer-holder", { hidden: true })
                /** upload json data to portal */
                if (response) {
                    const final_path = is_development ? path.join(__dirname, `../${response}`) : path.join(__dirname, `../../../${response}`);
                    const [fileChooser] = await Promise.all([
                        page.waitForFileChooser(),
                        page.click('#offline_file'),
                    ])
                    await page.waitForTimeout(2000);
                    await fileChooser.accept([final_path]);
                    await page.waitForSelector(".progress-bar", { visible: true })
                }
                const getFileStatus = () => {
                    return page.evaluate(async () => {
                        return await new Promise(resolve => {
                            const upload_file_status = setInterval(async () => {
                                const get_element = document.querySelector("table tbody tr td:nth-child(4)");
                                if (get_element) {
                                    const error_id = get_element.innerHTML;
                                    if (error_id !== 'In-Progress') {
                                        clearInterval(upload_file_status)
                                        const task_id = document.querySelector("table tbody tr td:nth-child(3)").innerHTML;
                                        const error_msg = document.querySelector("table tbody tr td:nth-child(5) span").innerHTML;
                                        if (error_id === 'Processed with Error') {
                                            resolve({ filing_progress: 2, status: error_id, error_json: { task_id, error_msg: '' } })
                                        } else if (error_id === 'Processed') {
                                            resolve({ filing_progress: 2, status: error_id, error_json: { task_id, error_id, error_msg } })
                                        } else {
                                            resolve({ filing_progress: 0, status: error_id, error_json: { task_id, error_id, error_msg } })
                                        }
                                    } else {
                                        if (document.querySelector(".fa.fa-refresh")) {
                                            document.querySelector(".fa.fa-refresh").click()
                                        }
                                    }
                                }
                            }, 2000);
                        })
                    })
                }
                const file_status_response = await getFileStatus();
                await updateGstr1FilingStatus(userData, { ...file_status_response, upload_history_json: JSON.stringify({ ...file_status_response.error_json, user_name: userData.username, url: page.url() }) });
                if (file_status_response.filing_progress === 0) {
                    if (file_status_response.status === 'Processed with Error') {
                        await page.click('table tbody tr td:nth-child(5) a')
                        await page.waitForSelector('table tbody tr td:nth-child(5) span', { visible: true })
                    }
                    await browser.close()
                }
                await page.waitForSelector(".dimmer-holder", { hidden: true })
                /** click on back to file return */
                await page.click('.btn.btn-default')
                await page.waitForSelector(".dimmer-holder", { hidden: true })
                await handleReturnSelectionPeriod(userData)
                await page.waitForSelector(".dimmer-holder", { hidden: true })
            } else if (process === 3) {
                /** assign userData to portal window */
                await page.evaluate(async (userData) => {
                    window.userData = userData;
                    return true;
                }, userData);
                /* download or generate error json zip */
                await page.exposeFunction("downloadErrorJson", downloadErrorJson);
                const error_status = await downloadErrorJson(userData)
                if (error_status === '1') {
                    await updateErrorReportStatus(userData, error_status);
                }
                return true
            }
        }
        /** click on prepare online after search click */
        await page.evaluate(() => {
            if (document.querySelectorAll('.btn.btn-primary.smallbutton')[0]) {
                document.querySelectorAll('.btn.btn-primary.smallbutton')[0].click();
            }
        });
        await page.waitForSelector(".dimmer-holder", { visible: true })
        await page.waitForSelector(".dimmer-holder", { hidden: true })
        if (process === 5) {
            await handleGstResetAllData(userData)
        }
        if (process === 1 || process === 4) {
            /** click on generate summary button */
            await page.evaluate(() => {
                if (document.querySelector("button[data-ng-click=\"checkForHsnRec('PTF')\"]")) {
                    document.querySelector("button[data-ng-click=\"checkForHsnRec('PTF')\"]").click();
                }
            });

            if (process === 1) {
                await updateGstr1FilingStatus(userData, { filing_progress: 3 });
            }
            await page.waitForSelector(".dimmer-holder", { hidden: true });
            let get_element = await page.evaluate(() => {
                return document.querySelector("button[data-ng-click=\"page('/auth/gstr1/gstr1sum')\"]").className
            });
            page.waitForSelector("button[data-ng-click=\"page('/auth/gstr1/gstr1sum')\"]", { visible: true });
            do {
                /** click on refresh button */
                await page.click('.btn.btn-primary.btn-circle.btn-sm.pull-right');
                await page.waitForSelector(".dimmer-holder", { hidden: true });
                get_element = await page.evaluate(() => {
                    return document.querySelector("button[data-ng-click=\"page('/auth/gstr1/gstr1sum')\"]").className
                });
            } while (get_element.includes('ng-hide'));
            const summaryGenerated = () => {
                // return page.evaluate(async (page) => {

                return true
                // }, page)
            }
            await summaryGenerated();
        }
        /** click on PROCEED TO FILE/SUMMARY button */
        await page.evaluate(() => {
            if (document.querySelector("button[data-ng-click=\"page('/auth/gstr1/gstr1sum')\"]")) {
                document.querySelector("button[data-ng-click=\"page('/auth/gstr1/gstr1sum')\"]").click();
            }
        });
        await page.waitForSelector(".dimmer-holder", { hidden: true });

        if ([1, 4].includes(process)) {
            /** here we update gstr1 filing status  */
            await page.evaluate(async (userData) => {
                window.userData = userData;
                return true;
            }, userData);

            await page.exposeFunction("updateGstr1FilingStatus", updateGstr1FilingStatus);
            /** to get gst summary from api call */
            await page.evaluate(() => {
                try {
                    (function () {
                        window.XMLHttpRequest = new Proxy(window.XMLHttpRequest, {
                            construct(target, args) {
                                const realXHR = new target(...args);
                                realXHR.addEventListener('readystatechange', async function (e) {
                                    let ajaxUrl = typeof realXHR._url != 'undefined' ? realXHR._url : realXHR.responseURL;
                                    if (realXHR.readyState == 4 && realXHR.status == 200 && (typeof realXHR._url != 'undefined' || typeof realXHR.responseURL != 'undefined')) {
                                        if (ajaxUrl.includes('/api/gstr1/summary')) {
                                            if ((typeof realXHR.responseType != 'undefined' && realXHR.responseType != 'blob') || typeof realXHR.responseText != 'undefined') {
                                                const response = realXHR.responseText
                                                await updateGstr1FilingStatus(userData, { filing_progress: 4, summary_json: response });
                                            }
                                        }
                                    }
                                }, false);
                                return realXHR;
                            }
                        });
                    })();
                } catch (error) {
                    console.log("-=-=-=-=-=-=-=-=", error)
                }
            });
            await page.waitForSelector(".dimmer-holder", { hidden: true })
            await page.click('.btn.btn-primary.btn-circle.btn-sm.pull-right')
        }
        if (process == 2) {
            let get_new_div = robotDiv('Click on the File Statement button to complate the Return process');
            await page.evaluate((get_new_div) => {
                let get_exsting_html = document.querySelector("div[data-ng-controller='headerCtrl'").outerHTML;
                document.querySelector("div[data-ng-controller='headerCtrl'").outerHTML = get_new_div + get_exsting_html;
                document.querySelector("button[data-ng-bind='trans.BTN_FILE_STAT'").style.border = "thick solid #f89c0c";
                let height = document.body.scrollHeight;
                window.scroll(0, height);
            }, get_new_div);
            const file_timer = setInterval(async () => {
                if (page.url().includes('returns/auth/file')) {
                    clearInterval(file_timer)
                    await page.waitForTimeout(1000)
                    await page.waitForSelector(".dimmer-holder", { hidden: true })
                    await page.click('.btn.btn-primary.btn-circle.btn-sm.pull-right')
                    await page.waitForSelector(".dimmer-holder", { hidden: true })
                    await page.click('#dscCheckbox');
                    await page.waitForSelector("select[name='pandsc']", { visible: true })
                    await page.waitForTimeout(2000)
                    const selector_val = await page.$('select[name="pandsc"]')
                    let select_usr = await page.evaluate(async () => {
                        return [...document.getElementsByTagName('select')][0].options[1].label;
                    });
                    await selector_val.type(select_usr);
                    await page.waitForSelector(".dimmer-holder", { hidden: true })
                    await page.evaluate(() => {
                        if (document.querySelectorAll('.btn.btn-primary')[2]) {
                            document.querySelectorAll('.btn.btn-primary')[2].click();
                        }
                    });
                    await page.waitForSelector(".dimmer-holder", { hidden: true })
                    const getSuccessId = () => {
                        return page.evaluate(async () => {
                            return await new Promise(resolve => {
                                const success_timer = setInterval(async () => {
                                    let get_element = document.querySelectorAll(".alert.alert-msg.alert-success span[data-ng-bind='message']");
                                    if (get_element.length) {
                                        let getReturnId = get_element[0].innerHTML;
                                        if (getReturnId) {
                                            clearInterval(success_timer)
                                            resolve(get_element[0].innerHTML)
                                        }
                                    }
                                }, 100);
                            })
                        })
                    }
                    let get_success_id = await getSuccessId();
                    await sendReturnSuccessId(userData, get_success_id, 1);
                    await browser.close();
                }
            }, 100);
        }
    } catch (error) {
        console.log("handleGstAfterLogIn----------------", error)
        catchErrorHandle(userData, error.stack, 'handleGstAfterLogIn');
        if (process == 1) {
            updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" });
            await browser.close();
        } else if (process == 2) {
            sendReturnSuccessId(userData, '', 2);
        }
        return false
    }
}

async function handleGstVerify(userData, BrowserView, mainWindow, screen) {
    try {
        if (userData?.captcha) {
            user_data = userData
            await page.evaluate(() => document.getElementById("username").value = "")
            await page.evaluate(() => document.getElementById("user_pass").value = "")
            /** fill captcha for login */
            await page.waitForSelector('[id="username"]');
            await page.type('[id="username"]', userData.username);
            await page.waitForSelector('[id="user_pass"]');
            await page.type('[id="user_pass"]', userData.password);
            await page.waitForSelector('[id="captcha"]');
            await page.type('[id="captcha"]', userData.captcha);
            await page.keyboard.press('Enter');
            await page.waitForSelector(".dimmer-holder", { visible: true });
            await page.waitForSelector(".dimmer-holder", { hidden: true });
            if (page.url().includes('login')) {
                return handleScreenshot(userData, true)
            } else {
                const process = userData.get_pan_for_munim ? 6 : userData.is_reset_data ? 5 : userData.is_re_generate_summary ? 4 : userData.error_ref_id ? 3 : 1
                /* handle pop up after login Expire Password */
                if (page.url() === 'https://services.gst.gov.in/services/auth/changepassword') {
                    updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" });
                    browser.close();
                    return { success_fully_logged_in: true, is_password_expire: true }
                } else {
                    if (process === 6) {
                        return await getPanDetailForMunim(userData)
                    } else {
                        handleGstAfterLogIn(userData, process)
                        return { success_fully_logged_in: true }
                    }
                }
            }
        } else if (userData?.username) {
            user_data = userData
            const launchOptions = {
                headless: is_development ? false : true,
                ignoreDefaultArgs: ['--disable-extensions'],
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true,
                defaultViewport: { width: 1920, height: 1080 },
                executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            };
            browser = await puppeteer.launch(launchOptions);
            [page] = await browser.pages();
            await page.goto(`https://services.gst.gov.in/services/login`, {
                timeout: 0,
                waitUntil: 'load'
            });
            /** fill user name and password to get captcha */
            await page.waitForSelector('[id="username"]');
            await page.type('[id="username"]', userData.username);

            await page.waitForSelector('[id="user_pass"]');
            await page.type('[id="user_pass"]', userData.password);
            return handleScreenshot(userData)
        }
    } catch (error) {
        console.log("handleGstVerify------------------------", error);
        catchErrorHandle(userData, error.stack, 'handleGstVerify');
        updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" });
        return false
    }
}

async function handleScreenshot(userData, isCaptchaAgain) {
    /** IW0079 below code is for capture captcha image */
    try {
        const login_error = {}
        if (isCaptchaAgain) {
            login_error.error_msg = await page.evaluate(() => {
                if (document.querySelector('span.err')) {
                    return 'Enter valid Captcha shown'
                } else if (!document.querySelector('div.err').className.includes('ng-hide')) {
                    return 'Invalid Username or Password. Please try again.'
                }
            });
        }
        const logo = await page.waitForSelector('[id="imgCaptcha"]')
        await page.waitForTimeout(1000);// logo is the element you want to capture
        let screenshot = await logo.screenshot();
        login_error.image_url = `data:image/png;base64,${screenshot.toString('base64')}`;
        if (login_error.error_msg === 'Invalid Username or Password. Please try again.') {
            setTimeout(async () => {
                await browser.close();
            }, 2000);
        }
        return login_error;
    } catch (error) {
        console.log('handleScreenshot-------------------', error);
        catchErrorHandle(userData, error.stack, 'handleScreenshot');
        updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" });
    }
}

async function handleReturnSelectionPeriod(userData) {
    /** IW0079 below code is for file return selection */
    try {
        const quarter = ['Quarter 1 (Apr - Jun)', 'Quarter 2 (Jul - Sep)', 'Quarter 3 (Oct - Dec)', 'Quarter 4 (Jan - Mar)']
        const quarter_month = [
            ['April', 'May', 'June'],
            ['July', 'August', 'September'],
            ['October', 'November', 'December'],
            ['January', 'February', 'March']
        ]
        let selected_quarter_index = 0
        let selected_month_index = 0
        quarter_month.map((ele, index) => {
            ele.map((item, i) => {
                if (item.includes(userData.selected_period[0])) {
                    selected_month_index = i
                    selected_quarter_index = index
                }
            })
        })
        let selected_year = ''
        if (selected_quarter_index === 3) {
            const previous_year = (Number(userData.selected_period[1]) - 1).toString()
            selected_year = `${userData.selected_period[1].splice(0, 2)}-${previous_year}`
        } else {
            const next_year = (Number(userData.selected_period[1]) + 1).toString()
            selected_year = `${userData.selected_period[1]}-${next_year.slice(2)}`
        }
        await page.waitForSelector("select[name='fin']", { visible: true })
        const selector_val = await page.$('select[name="fin"]')
        await selector_val.type(selected_year);
        const selector1_val = await page.$('select[name="quarter"]')
        await selector1_val.type(quarter[selected_quarter_index]);
        const selector2_val = await page.$('select[name="mon"]')
        await selector2_val.type(quarter_month[selected_quarter_index][selected_month_index]);
        /** search btn click after period selection */
        await page.click('.srchbtn');
        return true
    } catch (error) {
        console.log("handleReturnSelectionPeriod-------------------", error);
        catchErrorHandle(userData, error.stack, 'handleReturnSelectionPeriod');
        updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" });
        return false
    }
}

async function updateGstr1FilingStatus(userData, filing_progress, is_reset_data = false) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://munimdesktop.com',
                'origin': 'http://munimdesktop.com',
                'access-token': userData.access_token
            }
        };
        let data = {
            id: userData.company_id,
            select_period: userData.selected_period.join(' '),
            is_reset_data: is_reset_data,
            ...filing_progress
        };
        await axios.put(`${node_url}/set-gstr1-filing-data`, data, config).catch(error => {
            console.log("error===========", error);
        });

        if (filing_progress.filing_progress == 4) {
            await browser.close()
        }
        return true;
    } catch (error) {
        console.log("updateGstr1FilingStatus------------------", error);
        catchErrorHandle(userData, error.stack, 'updateGstr1FilingStatus');
        updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" });
        return false
    }
}
async function updateErrorReportStatus(userData, error_json_status) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://munimdesktop.com',
                'origin': 'http://munimdesktop.com',
                'access-token': userData.access_token
            }
        };
        let data = {
            gstr1_error_id: userData.error_id,
            error_json_status
        };
        await axios.put(`${node_url}/edit-error-report-status`, data, config).catch(error => {
            console.log("error===========", error);
        });

        await browser.close()
        return true;
    } catch (error) {
        console.log("updateGstr1FilingStatus------------------", error);
        catchErrorHandle(userData, error.stack, 'updateGstr1FilingStatus');
        updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" });
        return false
    }
}

async function getUploadedJsonData(userData) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://munimdesktop.com',
                'origin': 'http://munimdesktop.com',
                'access-token': userData.access_token
            }
        };

        let response = await axios.get(`${node_url}/upload-gstr1?id=${userData.company_id}&select_period=${userData.selected_period.join(' ')}&type=1`, config);
        if (response?.data.statusCode == 200) {
            const get_data = response?.data?.data ? JSON.stringify(response?.data?.data) : '';
            if (get_data) {
                const json_path = `${user_data.username}${new Date().getTime()}.json`;
                await fs.writeFile(json_path, get_data);
                return json_path;
            }
        }
    } catch (error) {
        console.log("getUploadedJsonData-------------", error);
        catchErrorHandle(userData, error.stack, 'getUploadedJsonData');
        updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" });
        return false
    }
}

async function sendReturnSuccessId(userData, get_success_id, filing_status, get_return_type = '') {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://munimdesktop.com',
                'origin': 'http://munimdesktop.com',
                'access-token': userData.access_token
            }
        };
        let data = {
            id: userData.company_id,
            select_period: userData.selected_period.join(' '),
            success_filing_id: get_success_id,
            filing_status: filing_status

        };
        if (get_return_type) {
            data.filing_type = userData.filling_type
        }
        await axios.put(`${node_url}/set-gstr1-filing-data`, data, config).catch(error => {
            console.log("error===========", error);
        });

        return true;
    } catch (error) {
        console.log("sendReturnSuccessId-----------------", error);
        catchErrorHandle(userData, error.stack, 'sendReturnSuccessId');
        updateGstr1FilingStatus(userData, { filing_progress: 0, summary_json: "{}" });
        return false
    }
}

async function catchErrorHandle(userData, error, module_type = '') {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://munimdesktop.com',
                'origin': 'http://munimdesktop.com',
                'access-token': userData.access_token
            }
        };
        let data = {
            table: 'error_desktop_app',
            user_id: '0',
            company_id: userData.company_id,
            log: { error, selected_period: userData?.selected_period, error_function: module_type },
            module_type: module_type
        };
        await axios.post(`${node_url}/create-error-log`, data, config).catch(error => {
            console.log("error===========", error);
        });

        return true;
    } catch (error) {
        console.log("getUploadedJsonData-----------------", error);
        return false
    }
}

async function downloadErrorJson(userData) {
    try {
        let err_json_generated = await page.evaluate(async (userData) => {
            const all_reference_id = [...document.querySelectorAll('table tbody tr td:nth-child(3)')]
            let is_element_found = ''
            all_reference_id.find((element, index) => {
                if (element.innerHTML === userData.error_ref_id) {
                    const download_element = document.querySelector(`table tbody tr:nth-child(${index + 1}) td:nth-child(5) span:nth-child(3) a`)
                    const generate_element = document.querySelector(`table tbody tr:nth-child(${index + 1}) td:nth-child(5) span a`)
                    if (!download_element.className) {
                        // download_element.click();
                        is_element_found = '1'
                        console.log('----download_element----->', download_element)
                        return 'download_element'
                    } else if (!generate_element.className) {
                        generate_element.click();
                        is_element_found = '0'
                        console.log('----generate_element----->', generate_element)
                        return 'generate_element'
                    } else {
                        is_element_found = '0'
                        return 'try after some time'
                    }
                }
            })
            return is_element_found
        }, userData);
        if (!err_json_generated) {
            await page.click("li a[ng-switch-when='next']");
            return await downloadErrorJson(userData);
        } else {
            /** here comes when error ref id match and error generate */
            return err_json_generated
        }
    } catch (error) {
        console.log("downloadErrorJson-----------------", error);
        catchErrorHandle(userData, error.stack);
        return false
    }
}

async function nillReturnAfterLogIn(userData) {
    try {
        /** handle pop up after login */
        await page.waitForSelector(".dimmer-holder", { hidden: true })
        if (page.url() === 'https://services.gst.gov.in/services/auth/fowelcome') {
            await page.evaluate(() => {
                if (document.querySelector('#adhrtableV .btn.btn-primary[data-dismiss]')) {
                    document.querySelector('#adhrtableV .btn.btn-primary[data-dismiss]').click()
                }
            });
        }
        /** click on return dashboard button after login */
        await page.evaluate(() => {
            if (document.querySelectorAll('.btn.btn-primary.pad-l-50.pad-r-50')[0]) {
                document.querySelectorAll('.btn.btn-primary.pad-l-50.pad-r-50')[0].click();
            }
        });
        await page.waitForSelector(".dimmer-holder", { visible: true })
        await page.waitForSelector(".dimmer-holder", { hidden: true })
        /** select date period for fill gstr1 */
        await handleReturnSelectionPeriod(userData);
        await page.waitForSelector(".dimmer-holder", { visible: true })
        await page.waitForSelector(".dimmer-holder", { hidden: true })

        /** click on prepare online after search click */
        await page.evaluate(() => {
            if (document.querySelectorAll('.btn.btn-primary.smallbutton')[0]) {
                document.querySelectorAll('.btn.btn-primary.smallbutton')[0].click();
            }
        });

        await page.waitForSelector(".dimmer-holder", { visible: true });
        await page.waitForSelector(".dimmer-holder", { hidden: true });

        const getCheckboxValue = () => {
            return page.evaluate(async () => {
                return await new Promise(resolve => {
                    if (document.getElementById('nilCheckbox').checked) {
                        resolve(false)
                    } else {
                        resolve(true)
                    }
                })
            })
        }

        let getNillCheckboxValue = await getCheckboxValue();
        if (getNillCheckboxValue) {
            await page.click('#nilCheckbox');
            await page.waitForTimeout(1000);
        }

        let get_new_div = robotDiv('Click on the File Statement button to complate the Return process');
        await page.evaluate((get_new_div) => {
            let get_exsting_html = document.querySelector("div[data-ng-controller='headerCtrl'").outerHTML;
            document.querySelector("div[data-ng-controller='headerCtrl'").outerHTML = get_new_div + get_exsting_html;
            document.querySelector("button[data-ng-click='nilFileStatement()'").style.border = "thick solid #f89c0c";
            let height = document.body.scrollHeight;
            window.scroll(0, height);
        }, get_new_div);

        const file_timer = setInterval(async () => {
            if (page.url().includes('returns/auth/file')) {
                clearInterval(file_timer)
                await page.waitForTimeout(1000)
                await page.waitForSelector(".dimmer-holder", { hidden: true })
                await page.click('.btn.btn-primary.btn-circle.btn-sm.pull-right')
                await page.waitForSelector(".dimmer-holder", { hidden: true })
                await page.click('#dscCheckbox');
                await page.waitForSelector("select[name='pandsc']", { visible: true })
                await page.waitForTimeout(2000)
                const selector_val = await page.$('select[name="pandsc"]')
                let select_usr = await page.evaluate(async () => {
                    return [...document.getElementsByTagName('select')][0].options[1].label;
                });
                await selector_val.type(select_usr);
                await page.waitForSelector(".dimmer-holder", { hidden: true })
                await page.evaluate(() => {
                    if (document.querySelectorAll('.btn.btn-primary')[2]) {
                        document.querySelectorAll('.btn.btn-primary')[2].click();
                    }
                });
                await page.waitForSelector(".dimmer-holder", { hidden: true })
                const getSuccessId = () => {
                    return page.evaluate(async () => {
                        return await new Promise(resolve => {
                            const success_timer = setInterval(async () => {
                                let get_element = document.querySelectorAll(".alert.alert-msg.alert-success span[data-ng-bind='message']");
                                if (get_element.length) {
                                    let getReturnId = get_element[0].innerHTML;
                                    if (getReturnId) {
                                        clearInterval(success_timer)
                                        resolve(get_element[0].innerHTML)
                                    }
                                }
                            }, 100);
                        })
                    })
                }
                let get_success_id = await getSuccessId();
                await sendReturnSuccessId(userData, get_success_id, 1, 'nill_return');
                await browser.close();
            }
        }, 100);
    } catch (error) {
        console.log("nillReturnAfterLogIn----------------", error)
        catchErrorHandle(userData, error.stack, 'nillReturnAfterLogIn');
        sendReturnSuccessId(userData, '', 2);
        return false
    }
}

module.exports = { launchGstApp, handleGstVerify, handleGstPuppeteer, handleGstPortalFromList }