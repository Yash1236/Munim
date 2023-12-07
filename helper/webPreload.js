/* eslint-disable no-undef */
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector("body").addEventListener("click", () => {
        setTimeout(() => {
            const identify_data = document.querySelector('#identify-user-data-to-portal');
            const submit_captcha_element = document.querySelector('#submit-captcha-to-portal');
            const file_evc_element = document.querySelector('#file-with-evc-munim-to-portal');
            const company_id = document.querySelector('#upload-gstr1-to-gst-portal')?.getAttribute('c-id')
            const access_token = localStorage.getItem('access_token');
            const file_evc_nill_return_element = document.querySelector('#file-with-evc-nil-munim-to-portal');
            const open_portal_from_list = document.querySelector('#open-gst-portal-from-list');
            if (open_portal_from_list) {
                open_portal_from_list.addEventListener('click', async (e) => {
                    const user_id = document.querySelector('#open-gst-portal-from-list').getAttribute('u-id')
                    const user_psw = document.querySelector('#open-gst-portal-from-list').getAttribute('u-pw')
                    if (user_id && user_psw) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        window.stop();
                        document.getElementById('open-gst-portal-from-list').setAttribute('u-id', '')
                        document.getElementById('open-gst-portal-from-list').setAttribute('u-pw', '')
                        await openPortalFromListPage({ username: user_id, password: user_psw })
                    }
                })
            }
            if (file_evc_element) {
                file_evc_element.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    window.stop();
                    const user_id = document.querySelector('#munim-gst-u-data').getAttribute('u-id')
                    const user_psw = document.querySelector('#munim-gst-u-data').getAttribute('p-id')
                    const selected_period = document.querySelector('#period-of-return')?.value
                    let final_selected_period = selected_period
                    if (selected_period.includes('GSTR1')) {
                        final_selected_period = selected_period.replace('GSTR1', 'Quaterly')
                    } else if (selected_period.includes('IFF')) {
                        final_selected_period = selected_period.replace(' (IFF)', '')
                    }
                    final_selected_period = final_selected_period.split(' ')
                    if (user_id && user_psw) {
                        await portalLoginForFile({ username: user_id, password: user_psw, captcha: '', company_id, selected_period: final_selected_period, access_token })
                    }
                })
            }
            if (identify_data) {
                identify_data.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    window.stop();
                    const user_id = document.querySelector('#gst_portal_usr_name')
                    const user_psw = document.querySelector('#gst_portal_password')
                    const selected_period = document.querySelector('#period-of-return')?.value
                    let final_selected_period = selected_period
                    if (selected_period.includes('GSTR1')) {
                        final_selected_period = selected_period.replace('GSTR1', 'Quaterly')
                    } else if (selected_period.includes('IFF')) {
                        final_selected_period = selected_period.replace(' (IFF)', '')
                    }
                    final_selected_period = final_selected_period.split(' ')
                    if (user_id && user_psw && user_psw.value && user_id.value) {
                        const login_error = await gstVerifyHost({ username: user_id.value, password: user_psw.value, captcha: '', company_id, selected_period: final_selected_period, access_token })
                        if (login_error && login_error.image_url) {
                            document.querySelector('#identify-user-captcha-from-portal').click();
                        }
                        const captchaTimer = setInterval(() => {
                            const captchaElement = document.querySelector('#upload-munim-gst-captcha')
                            if (login_error && login_error.image_url && captchaElement) {
                                captchaElement.src = login_error.image_url
                                clearInterval(captchaTimer)
                            }
                        }, 10);
                    }
                })
            }
            if (submit_captcha_element) {
                submit_captcha_element.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    window.stop();
                    const user_id = document.querySelector('#gst_portal_usr_name')
                    const user_psw = document.querySelector('#gst_portal_password')
                    const captcha = document.querySelector('#munim_gst_captcha')
                    const error_ref_id = document.querySelector('#submit-captcha-to-portal').getAttribute('e-r-id')
                    const error_id = document.querySelector('#submit-captcha-to-portal').getAttribute('e-id')
                    const is_re_generate_summary = document.querySelector('#submit-captcha-to-portal').getAttribute('r-gs')
                    const is_reset_data = document.querySelector('#submit-captcha-to-portal').getAttribute('rst-d')
                    const selected_period = document.querySelector('#period-of-return')?.value
                    let final_selected_period = selected_period
                    if (selected_period.includes('GSTR1')) {
                        final_selected_period = selected_period.replace('GSTR1', 'Quaterly')
                    } else if (selected_period.includes('IFF')) {
                        final_selected_period = selected_period.replace(' (IFF)', '')
                    }
                    final_selected_period = final_selected_period.split(' ')
                    const get_pan_for_munim = document.querySelector('#get-pan-for-munim-portal').value
                    const login_error = await gstVerifyHost({ username: user_id.value, password: user_psw.value, captcha: captcha.value, company_id, selected_period: final_selected_period, access_token, error_ref_id, error_id, is_re_generate_summary, is_reset_data, get_pan_for_munim });
                    const captchaElement = document.querySelector('#upload-munim-gst-captcha')
                    const success_login_element = document.querySelector('#successfully-login-on-gst-portal-from-munim')
                    if (login_error && login_error.error_msg) {
                        document.querySelector('#gst-portal-login-error div span').innerHTML = login_error.error_msg
                        const available_class = document.getElementById('gst-portal-login-error').className
                        const new_class = available_class.replace('d-none', 'd-block')
                        document.getElementById('gst-portal-login-error').className = new_class
                    }
                    if (login_error && login_error.image_url && captchaElement) {
                        document.querySelector('#identify-user-captcha-from-portal').click();
                        captchaElement.src = login_error.image_url
                    } else if (login_error && login_error.success_fully_logged_in) {
                        success_login_element.click()
                        if (login_error.is_password_expire) {
                            alert('Your password has been expired. Kindly change your password.');
                        }
                    }
                })
            }
            if (file_evc_nill_return_element) {
                file_evc_nill_return_element.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    window.stop();
                    const user_id = document.querySelector('#munim-gst-u-data').getAttribute('u-id');
                    const user_psw = document.querySelector('#munim-gst-u-data').getAttribute('p-id');
                    const selected_period = document.querySelector('#period-of-return')?.value
                    let final_selected_period = selected_period
                    if (selected_period.includes('GSTR1')) {
                        final_selected_period = selected_period.replace('GSTR1', 'Quaterly')
                    } else if (selected_period.includes('IFF')) {
                        final_selected_period = selected_period.replace(' (IFF)', '')
                    }
                    final_selected_period = final_selected_period.split(' ')
                    const company_id = document.querySelector('#munim-gst-u-data')?.getAttribute('c-id');
                    if (user_id && user_psw) {
                        /*Nill Return File Process */
                        await portalLoginForFile({ username: user_id, password: user_psw, captcha: '', filling_type: 4, company_id, selected_period: final_selected_period, access_token });
                    }
                })
            }
        }, 100);
    });
});

global.gstVerifyHost = async (e) => {
    const login_error = await ipcRenderer.invoke('gstVerifyUser', e)
    return login_error
};
global.portalLoginForFile = async (e) => {
    const login_error = await ipcRenderer.invoke('portalLoginForFile', e)
    return login_error
};
global.openPortalFromListPage = async (e) => {
    const login_error = await ipcRenderer.invoke('openPortalFromListPage', e)
    return login_error
};