const CryptoJS = require('crypto-js');
const { gst_secret_key } = require('./config');

function encrypt_decrypt_str(value, encrypt = true) {
    if (encrypt) {
        try {
            const ciphertext = CryptoJS.AES.encrypt(value, gst_secret_key).toString()
            return ciphertext
        } catch (error) {
            return ''
        }
    } else {
        try {
            const bytes = CryptoJS.AES.decrypt(value, gst_secret_key)
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
            return decryptedData
        } catch (error) {
            return ''
        }
    }
}

function robotDiv(text) {
    return `<div class="robot-container" style="padding: 10px;position: sticky;z-index: 999999;background-color: #fff;width: 100%"><div class="robot-section" style="display: flex; align-items: center;gap: 1rem"><div class="robot-icon" style="width: 90px;height: 90px;object-fit: cover;"><svg width="85" height="85" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.8806 7.20003C20.8806 7.20003 20.1963 7.46342 20.0293 7.54402C12.3203 11.3558 7.64163 17.6681 5.99314 26.4809C5.98445 26.5272 5.9626 26.5698 5.93033 26.6033C5.89806 26.6369 5.85681 26.66 5.81178 26.6696L2.04079 27.4628C1.9314 27.4864 1.90453 27.4481 1.96018 27.3478C2.55126 26.2843 2.77772 25.2857 2.63954 24.3519C2.50425 23.4319 1.7155 22.4057 1.88246 21.2852C2.03407 20.2905 2.53399 19.5415 3.38222 19.0382C5.36272 17.8617 5.77148 16.6439 5.63043 14.3615C5.52392 12.6395 6.48826 11.5691 8.06863 11.227C9.79196 10.8515 10.9041 9.82438 11.405 8.14556C12.0814 5.86618 12.5219 5.1054 15.0435 5.29707C16.7362 5.42386 17.5669 4.73421 18.7742 3.69295C19.551 3.02303 19.6685 2.04854 20.4035 1.61998C21.1385 1.19143 22.7928 1.55806 22.7928 1.55806C22.7928 1.55806 25.492 2.35422 26.8948 1.62293C27.5713 1.26908 28.219 0.396251 29.025 0.133812C31.9007 -0.800941 32.7615 3.53077 36.5843 1.75268C37.9948 1.09511 39.5752 1.20126 40.41 2.67563C41.452 4.51172 42.8932 5.37079 44.7337 5.25284C46.504 5.13784 47.8339 5.67746 48.2312 7.62658C48.5104 9.00955 48.9163 9.77327 49.967 10.5429C51.5157 11.6811 53.6603 11.0265 54.0518 13.5034C54.1727 14.2613 53.8906 15.2697 54.0805 16.1897C54.1132 16.3411 54.0546 16.4335 53.9049 16.4669L50.5111 17.1894C50.4209 17.209 50.3498 17.1786 50.298 17.098C44.014 7.07222 32.2635 2.86435 21.2873 7.06337C21.1683 7.11055 20.8806 7.20003 20.8806 7.20003Z" fill="#1773EA"></path><path d="M18.3684 10.4548C28.93 4.26835 41.6622 7.17582 48.4931 17.4787C48.5035 17.4943 48.5099 17.5122 48.5119 17.5309C48.5138 17.5496 48.5113 17.5685 48.5045 17.586C48.4977 17.6035 48.4868 17.6189 48.4727 17.6311C48.4587 17.6432 48.442 17.6517 48.4241 17.6557L8.11757 26.1775C8.0856 26.184 8.05258 26.1823 8.02142 26.1725C7.99025 26.1628 7.9619 26.1454 7.93886 26.1218C7.91582 26.0982 7.8988 26.0691 7.88931 26.0372C7.87981 26.0053 7.87813 25.9714 7.8844 25.9387C9.14716 19.6126 12.3645 14.6312 17.5364 10.9944C17.6016 10.9487 18.3684 10.4548 18.3684 10.4548ZM24.7215 12.8168L24.8395 14.0995C24.8625 14.3354 24.9307 14.3501 25.0439 14.1437C25.539 13.2591 26.2203 13.0772 27.0877 13.5982C27.116 13.6159 27.1491 13.6237 27.1821 13.6204C27.2151 13.6171 27.2461 13.6028 27.2705 13.5798C27.2949 13.5568 27.3114 13.5264 27.3173 13.493C27.3233 13.4596 27.3185 13.4251 27.3036 13.3947L26.8517 12.4216C26.8114 12.3351 26.8142 12.2506 26.8603 12.168L27.4418 11.1625C27.5224 11.021 27.484 10.9581 27.3266 10.9738L26.3018 11.0711C26.1963 11.0809 26.108 11.0446 26.037 10.962L25.3202 10.1216C25.2128 9.9958 25.1427 10.0145 25.1101 10.1776L24.8942 11.2185C24.8692 11.3326 24.804 11.4102 24.6984 11.4515L23.6449 11.8702C23.4933 11.9312 23.4885 12.0019 23.6305 12.0825L24.6092 12.6428C24.6764 12.6801 24.7138 12.7381 24.7215 12.8168ZM30.9048 11.021L30.4298 10.3693C30.3453 10.2533 30.2849 10.2661 30.2484 10.4076L30.0383 11.2569C30.0095 11.3768 29.9375 11.4574 29.8224 11.4987L29.0883 11.7611C28.9617 11.8063 28.955 11.8653 29.0682 11.938L29.7735 12.3804C29.8541 12.4315 29.8992 12.5052 29.9088 12.6015L30.0124 13.5038C30.0373 13.724 30.1083 13.7407 30.2254 13.554C30.6073 12.9406 31.1322 12.8187 31.8 13.1883C31.9919 13.2925 32.0476 13.2414 31.967 13.035L31.6417 12.1857C31.6033 12.0815 31.6148 11.9842 31.6762 11.8938L32.1512 11.192C32.2203 11.0898 32.1944 11.0426 32.0735 11.0505L31.1207 11.1212C31.0305 11.1291 30.9585 11.0957 30.9048 11.021ZM34.149 13.0084C34.5808 13.1284 34.7372 13.4026 34.6182 13.8311C34.6048 13.8764 34.6143 13.9167 34.647 13.952L34.7218 14.0287C34.7928 14.0995 34.8533 14.0916 34.9032 14.0051C35.1718 13.5451 35.5211 13.4655 35.951 13.7663C36.0047 13.8036 36.0575 13.8036 36.1093 13.7663C36.2734 13.6513 35.9423 13.1795 35.8992 12.9996C35.8761 12.9111 35.8963 12.8335 35.9596 12.7666C36.0805 12.6389 36.1803 12.4934 36.259 12.3302C36.378 12.0884 36.3166 12.0226 36.0748 12.1327C35.5393 12.3784 35.2006 12.2231 35.0586 11.6668C34.9876 11.3955 34.908 11.3925 34.8197 11.6579C34.7544 11.8525 34.7314 12.0501 34.7506 12.2506C34.7621 12.3764 34.7074 12.4511 34.5865 12.4747C34.0281 12.5789 33.7124 12.9347 33.6395 13.5422C33.6371 13.5624 33.6401 13.583 33.6481 13.6017C33.6561 13.6204 33.6688 13.6366 33.6849 13.6486C33.701 13.6606 33.72 13.668 33.7398 13.67C33.7597 13.6721 33.7797 13.6686 33.7978 13.6601C34.0089 13.5579 34.0847 13.3829 34.0252 13.1352C33.9983 13.0212 34.0396 12.979 34.149 13.0084ZM22.1681 14.2027C22.3562 14.0002 22.4992 13.7692 22.597 13.5097C22.6623 13.3367 22.6095 13.2817 22.4387 13.3446C21.767 13.5903 21.2844 13.3977 20.9908 12.7666C20.9486 12.6742 20.8795 12.6438 20.7835 12.6752C20.6684 12.7136 20.5561 13.4449 20.4899 13.5952C20.4554 13.6758 20.3978 13.7348 20.3172 13.7722L19.5486 14.126C19.372 14.2086 19.3778 14.2764 19.5659 14.3295C20.274 14.532 20.5686 15.0195 20.4496 15.7921C20.3805 16.2521 20.4592 16.2865 20.6856 15.8953C21.0695 15.2308 21.5991 15.0991 22.2746 15.5001C22.4877 15.6259 22.5462 15.5729 22.4502 15.3409L22.1106 14.5093C22.0645 14.3953 22.0837 14.2931 22.1681 14.2027ZM17.0643 16.4614C16.9319 16.7622 16.6959 16.9254 16.3562 16.9509C16.3227 16.9535 16.2914 16.9685 16.2682 16.9931C16.245 17.0177 16.2315 17.0503 16.2301 17.0848C16.2287 17.1193 16.2395 17.1534 16.2606 17.1808C16.2817 17.2083 16.3115 17.2272 16.3447 17.234C16.8935 17.3343 17.096 17.6802 16.9521 18.272C16.9367 18.3349 16.9597 18.3663 17.0212 18.3663C17.0634 18.3663 17.1037 18.3653 17.1421 18.3634C17.2303 18.3594 17.2908 18.3162 17.3234 18.2336C17.4827 17.8326 17.7504 17.7648 18.1265 18.0302C18.2244 18.097 18.3146 18.0881 18.3971 18.0036L18.4921 17.9063C18.5708 17.8277 18.5708 17.7481 18.4921 17.6675L18.1928 17.3608C18.0795 17.2448 18.0949 17.1495 18.2388 17.0748C18.4576 16.9627 18.5603 16.8005 18.5468 16.5882C18.5392 16.4408 18.4672 16.3926 18.3309 16.4437C17.9107 16.603 17.6209 16.486 17.4616 16.0928C17.4213 15.9886 17.3484 15.9562 17.2428 15.9955L16.6757 16.2137C16.6105 16.2393 16.6105 16.2648 16.6757 16.2904C16.7525 16.3218 16.8302 16.3218 16.9089 16.2904C17.0931 16.2196 17.1449 16.2766 17.0643 16.4614Z" fill="#1773EA"></path><path d="M45.1438 54.8359C42.7862 54.715 41.7614 55.0983 40.5236 57.2037C39.7867 58.4569 38.333 59.0968 36.9541 58.4274C35.1675 57.5585 33.5382 57.7355 32.0662 58.9582C28.6292 61.8155 27.9815 57.8878 24.7113 57.8996C22.9208 57.9026 21.8356 59.5804 19.953 58.1031C19.7726 57.9615 19.4368 57.5104 18.9455 56.7496C18.0128 55.3008 16.6752 54.6403 14.9327 54.768C13.1566 54.8978 11.9706 54.3906 11.5733 52.4828C11.153 50.4638 9.9632 49.2254 8.00382 48.7673C6.29392 48.3663 5.39003 47.2015 5.68365 45.3202C5.70092 45.2023 5.76713 45.1315 5.88227 45.1079L10.0505 44.2498C10.1369 44.2322 10.206 44.2597 10.2578 44.3324C22.6848 61.7241 48.6385 56.1539 53.3565 35.1972C53.3796 35.0969 53.441 35.036 53.5408 35.0144L56.9778 34.286C57.0834 34.2624 57.1294 34.3057 57.116 34.4158C56.8368 36.8337 59.3354 39.3136 56.2438 41.0623C54.1712 42.2329 54.0416 43.5628 54.0589 45.7891C54.0685 47.3775 53.3402 48.3751 51.874 48.7821C49.9799 49.3099 48.7277 49.9911 48.2556 52.1201C47.8814 53.8156 46.9861 54.9332 45.1438 54.8359Z" fill="#1773EA"></path><path d="M40.5297 50.1596C30.6705 55.4673 18.9976 52.9373 12.1523 43.9436C12.0794 43.8492 12.1005 43.7893 12.2156 43.7637L51.3735 35.4719C51.3933 35.4676 51.4139 35.4686 51.4332 35.4748C51.4525 35.481 51.47 35.4922 51.4839 35.5073C51.4977 35.5224 51.5076 35.5409 51.5125 35.561C51.5173 35.5812 51.5171 35.6022 51.5117 35.6222C49.8824 41.7773 46.4098 46.5139 41.094 49.8323C40.9846 49.9011 40.5297 50.1596 40.5297 50.1596ZM42.5649 43.7166L42.9766 44.2149C43.0706 44.3289 43.1339 44.3132 43.1666 44.1677L43.3047 43.5367C43.3259 43.4384 43.3834 43.3735 43.4775 43.3421L43.9841 43.1769C44.2489 43.0904 44.2461 43.0138 43.9755 42.9469C43.4803 42.827 43.2673 42.4968 43.3364 41.9561C43.3921 41.5158 43.3239 41.4785 43.132 41.8441C42.9037 42.2844 42.5803 42.3945 42.1619 42.1744C42.0832 42.1311 42.0122 42.1419 41.9489 42.2068L41.8741 42.2864C41.805 42.3572 41.8059 42.427 41.8769 42.4958C42.3634 42.9676 41.8971 43.1651 41.7359 43.5721C41.6802 43.7156 41.7253 43.7706 41.8712 43.7372L42.326 43.634C42.422 43.6124 42.5016 43.6399 42.5649 43.7166ZM39.9914 45.303C39.8341 44.9884 39.8293 44.6877 39.9771 44.4007C40.0231 44.3102 39.9972 44.2768 39.8993 44.3004C39.5712 44.3771 39.3054 44.5609 39.102 44.8518C39.0482 44.9265 38.9772 44.9521 38.8889 44.9285L38.0397 44.6955C37.8939 44.6543 37.8488 44.7063 37.9044 44.8518L38.2182 45.645C38.2566 45.7453 38.246 45.8397 38.1865 45.9281L37.7432 46.5739C37.6569 46.6977 37.6885 46.7567 37.8382 46.7508L38.7162 46.7125C38.8218 46.7085 38.9052 46.7498 38.9667 46.8363L39.4244 47.4792C39.5549 47.662 39.6326 47.6404 39.6575 47.4143L39.7381 46.68C39.7496 46.5778 39.8015 46.5061 39.8936 46.4648L40.7831 46.0579C40.9212 45.995 40.9241 45.9252 40.7917 45.8485L40.1699 45.4946C40.0912 45.4494 40.0317 45.3855 39.9914 45.303ZM33.4426 48.0748L32.8553 49.0273C32.7786 49.1511 32.8112 49.2061 32.9532 49.1924L34.0413 49.0892C34.1526 49.0774 34.2438 49.1157 34.3148 49.2042L35.0201 50.0829C35.0396 50.1085 35.0667 50.127 35.0973 50.1355C35.1279 50.144 35.1603 50.1422 35.1898 50.1302C35.2193 50.1183 35.2442 50.0969 35.2608 50.0692C35.2775 50.0415 35.2849 50.0091 35.282 49.9767C35.2072 48.9624 35.662 48.4345 36.6465 48.3933C36.9958 48.3795 37.0178 48.2842 36.7127 48.1072L35.7023 47.5204C35.5633 47.4407 35.4601 47.3088 35.4144 47.1525C35.3687 46.9962 35.3842 46.8278 35.4576 46.683C35.5881 46.4294 35.5862 46.225 35.4519 46.0697C35.3674 45.9714 35.2916 45.9773 35.2244 46.0873C34.7101 46.9445 34.0385 47.088 33.2094 46.5179C32.9772 46.3567 32.9148 46.4097 33.0223 46.6771L33.4685 47.7799C33.5088 47.8822 33.5001 47.9804 33.4426 48.0748ZM25.0427 48.0807C25.0831 48.2851 25.1848 48.4306 25.3479 48.5171C25.4995 48.5957 25.5695 48.5486 25.558 48.3756C25.5254 47.8251 25.7567 47.5548 26.2518 47.5647C26.2882 47.5647 26.3113 47.546 26.3209 47.5086C26.3266 47.4831 26.3362 47.4575 26.3496 47.432C26.4072 47.3278 26.3794 47.2619 26.2662 47.2344C25.7653 47.1047 25.5743 46.7724 25.6933 46.2377C25.7893 45.8052 25.7135 45.7826 25.4659 46.1699C25.1761 46.624 24.8067 46.6948 24.3576 46.3822C24.135 46.2269 24.0679 46.28 24.1561 46.5414C24.2156 46.7164 24.3029 46.8756 24.4181 47.0192C24.4718 47.088 24.4776 47.1597 24.4354 47.2344L24.0986 47.8271C24.016 47.9726 24.0554 48.0325 24.2166 48.007L24.8038 47.9097C24.9362 47.888 25.0159 47.9451 25.0427 48.0807ZM29.4067 49.1334L29.9105 49.7969C30.0237 49.9482 30.0947 49.9296 30.1235 49.7408L30.2415 48.9712C30.2569 48.871 30.3097 48.7992 30.3999 48.756L31.2462 48.352C31.4707 48.2439 31.463 48.1584 31.2232 48.0954C30.4881 47.9008 30.2041 47.4123 30.3711 46.6299C30.3777 46.5996 30.3735 46.5676 30.3593 46.5399C30.3451 46.5122 30.3218 46.4906 30.2937 46.4791C30.2657 46.4676 30.2347 46.467 30.2066 46.4774C30.1785 46.4878 30.1551 46.5084 30.1408 46.5356C29.757 47.2177 29.2062 47.3681 28.4885 46.9867C28.3081 46.8924 28.2591 46.9395 28.3417 47.1283L28.6727 47.8979C28.7053 47.9745 28.7024 48.0492 28.6641 48.122L28.238 48.9476C28.1709 49.0833 28.2102 49.1413 28.3561 49.1216L29.1419 49.0213C29.2513 49.0076 29.3396 49.0449 29.4067 49.1334Z" fill="#1773EA"></path><path d="M24.6099 12.6428L23.6312 12.0826C23.4892 12.002 23.494 11.9312 23.6456 11.8703L24.6992 11.4515C24.8047 11.4103 24.87 11.3326 24.8949 11.2186L25.1108 10.1777C25.1434 10.0145 25.2135 9.99584 25.321 10.1217L26.0377 10.962C26.1087 11.0446 26.197 11.081 26.3026 11.0712L27.3274 10.9738C27.4847 10.9581 27.5231 11.021 27.4425 11.1626L26.861 12.1681C26.815 12.2506 26.8121 12.3352 26.8524 12.4217L27.3043 13.3948C27.3192 13.4251 27.324 13.4596 27.318 13.493C27.3121 13.5264 27.2957 13.5569 27.2713 13.5799C27.2469 13.6029 27.2158 13.6171 27.1828 13.6204C27.1499 13.6237 27.1167 13.6159 27.0884 13.5982C26.221 13.0773 25.5397 13.2591 25.0446 14.1437C24.9314 14.3502 24.8633 14.3354 24.8402 14.0995L24.7222 12.8168C24.7145 12.7382 24.6771 12.6802 24.6099 12.6428Z" fill="white"></path><path d="M31.1211 11.1211L32.0739 11.0504C32.1948 11.0425 32.2207 11.0897 32.1517 11.1919L31.6767 11.8937C31.6153 11.9841 31.6038 12.0815 31.6421 12.1856L31.9674 13.0349C32.048 13.2413 31.9924 13.2924 31.8005 13.1882C31.1326 12.8186 30.6077 12.9405 30.2259 13.5539C30.1088 13.7406 30.0378 13.7239 30.0128 13.5037L29.9092 12.6014C29.8996 12.5051 29.8545 12.4314 29.7739 12.3803L29.0686 11.9379C28.9554 11.8652 28.9621 11.8062 29.0888 11.761L29.8228 11.4986C29.938 11.4573 30.01 11.3767 30.0387 11.2568L30.2489 10.4075C30.2853 10.266 30.3458 10.2532 30.4302 10.3692L30.9052 11.0209C30.9589 11.0956 31.0309 11.129 31.1211 11.1211Z" fill="white"></path><path d="M34.026 13.1346C34.0855 13.3823 34.0097 13.5572 33.7986 13.6594C33.7804 13.668 33.7604 13.6714 33.7406 13.6694C33.7208 13.6673 33.7018 13.6599 33.6857 13.6479C33.6696 13.6359 33.6569 13.6197 33.6489 13.601C33.6409 13.5823 33.6379 13.5618 33.6402 13.5415C33.7132 12.9341 34.0288 12.5782 34.5873 12.4741C34.7082 12.4505 34.7629 12.3758 34.7514 12.2499C34.7322 12.0494 34.7552 11.8519 34.8205 11.6572C34.9087 11.3919 34.9884 11.3948 35.0594 11.6661C35.2014 12.2224 35.5401 12.3777 36.0755 12.132C36.3174 12.0219 36.3788 12.0878 36.2598 12.3296C36.1811 12.4927 36.0813 12.6382 35.9604 12.766C35.8971 12.8328 35.8769 12.9105 35.8999 12.9989C35.9431 13.1788 36.2742 13.6506 36.1101 13.7656C36.0583 13.803 36.0055 13.803 35.9518 13.7656C35.5219 13.4648 35.1726 13.5444 34.9039 14.0045C34.854 14.0909 34.7936 14.0988 34.7226 14.028L34.6477 13.9514C34.6151 13.916 34.6055 13.8757 34.619 13.8305C34.7379 13.4019 34.5815 13.1277 34.1497 13.0078C34.0404 12.9783 33.9991 13.0206 34.026 13.1346Z" fill="white"></path><path d="M22.1113 14.5088L22.451 15.3404C22.547 15.5724 22.4884 15.6254 22.2754 15.4996C21.5999 15.0986 21.0702 15.2303 20.6864 15.8948C20.46 16.286 20.3813 16.2516 20.4504 15.7916C20.5693 15.019 20.2748 14.5315 19.5666 14.329C19.3786 14.2759 19.3728 14.2081 19.5494 14.1255L20.3179 13.7717C20.3985 13.7343 20.4561 13.6753 20.4907 13.5947C20.5569 13.4444 20.6691 12.7131 20.7843 12.6747C20.8802 12.6433 20.9493 12.6737 20.9915 12.7661C21.2852 13.3972 21.7678 13.5898 22.4395 13.3441C22.6103 13.2812 22.6631 13.3362 22.5978 13.5092C22.4999 13.7687 22.357 13.9997 22.1689 14.2022C22.0845 14.2926 22.0653 14.3948 22.1113 14.5088Z" fill="white"></path><path d="M16.9094 16.2902C16.8307 16.3216 16.753 16.3216 16.6762 16.2902C16.611 16.2646 16.611 16.2391 16.6762 16.2135L17.2433 15.9953C17.3488 15.956 17.4218 15.9884 17.4621 16.0926C17.6214 16.4858 17.9111 16.6028 18.3314 16.4435C18.4677 16.3924 18.5396 16.4406 18.5473 16.588C18.5608 16.8003 18.4581 16.9625 18.2393 17.0746C18.0954 17.1493 18.08 17.2446 18.1932 17.3606L18.4926 17.6673C18.5713 17.7479 18.5713 17.8275 18.4926 17.9061L18.3976 18.0034C18.3151 18.0879 18.2249 18.0968 18.127 18.03C17.7509 17.7646 17.4832 17.8324 17.3239 18.2334C17.2913 18.316 17.2308 18.3592 17.1425 18.3632C17.1042 18.3651 17.0639 18.3661 17.0216 18.3661C16.9602 18.3661 16.9372 18.3347 16.9526 18.2717C17.0965 17.68 16.894 17.3341 16.3452 17.2338C16.312 17.227 16.2821 17.2081 16.2611 17.1806C16.24 17.1532 16.2292 17.1191 16.2306 17.0846C16.232 17.0501 16.2455 17.0175 16.2687 16.9929C16.2919 16.9683 16.3231 16.9533 16.3567 16.9507C16.6964 16.9252 16.9324 16.762 17.0648 16.4612C17.1454 16.2764 17.0936 16.2194 16.9094 16.2902Z" fill="white"></path><path d="M42.3279 43.6334L41.873 43.7366C41.7272 43.77 41.6821 43.715 41.7377 43.5715C41.8989 43.1646 42.3653 42.967 41.8788 42.4952C41.8078 42.4264 41.8068 42.3566 41.8759 42.2858L41.9508 42.2062C42.0141 42.1413 42.0851 42.1305 42.1638 42.1738C42.5821 42.3939 42.9055 42.2839 43.1339 41.8435C43.3258 41.4779 43.3939 41.5152 43.3383 41.9556C43.2692 42.4962 43.4822 42.8264 43.9773 42.9463C44.2479 43.0132 44.2508 43.0899 43.986 43.1764L43.4793 43.3415C43.3853 43.3729 43.3277 43.4378 43.3066 43.5361L43.1684 44.1671C43.1358 44.3126 43.0725 44.3283 42.9784 44.2143L42.5668 43.716C42.5035 43.6393 42.4238 43.6118 42.3279 43.6334Z" fill="white"></path><path d="M40.1716 45.4945L40.7933 45.8484C40.9258 45.925 40.9229 45.9948 40.7847 46.0577L39.8952 46.4647C39.8031 46.5059 39.7513 46.5777 39.7398 46.6799L39.6592 47.4141C39.6342 47.6402 39.5565 47.6618 39.426 47.479L38.9683 46.8362C38.9069 46.7497 38.8234 46.7084 38.7179 46.7123L37.8399 46.7507C37.6902 46.7566 37.6585 46.6976 37.7449 46.5738L38.1882 45.928C38.2477 45.8395 38.2582 45.7452 38.2199 45.6449L37.9061 44.8517C37.8504 44.7062 37.8955 44.6541 38.0414 44.6954L38.8906 44.9283C38.9789 44.9519 39.0499 44.9264 39.1036 44.8517C39.307 44.5607 39.5728 44.3769 39.901 44.3003C39.9988 44.2767 40.0248 44.3101 39.9787 44.4005C39.8309 44.6875 39.8357 44.9883 39.9931 45.3028C40.0334 45.3854 40.0929 45.4493 40.1716 45.4945Z" fill="white"></path><path d="M33.4707 47.7802L33.0245 46.6774C32.917 46.41 32.9794 46.3569 33.2116 46.5181C34.0407 47.0882 34.7123 46.9447 35.2267 46.0876C35.2938 45.9775 35.3696 45.9716 35.4541 46.0699C35.5884 46.2252 35.5903 46.4297 35.4598 46.6833C35.3864 46.8281 35.3709 46.9964 35.4166 47.1527C35.4623 47.309 35.5655 47.441 35.7045 47.5207L36.7149 48.1075C37.02 48.2844 36.998 48.3798 36.6487 48.3935C35.6642 48.4348 35.2094 48.9626 35.2842 49.977C35.2871 50.0094 35.2797 50.0418 35.2631 50.0695C35.2464 50.0971 35.2215 50.1185 35.192 50.1305C35.1625 50.1425 35.1301 50.1443 35.0995 50.1358C35.0689 50.1272 35.0418 50.1088 35.0223 50.0832L34.317 49.2044C34.246 49.116 34.1548 49.0776 34.0435 49.0894L32.9554 49.1926C32.8134 49.2064 32.7808 49.1514 32.8575 49.0275L33.4448 48.0751C33.5024 47.9807 33.511 47.8824 33.4707 47.7802Z" fill="white"></path><path d="M24.8058 47.9097L24.2185 48.007C24.0573 48.0325 24.018 47.9726 24.1005 47.8271L24.4373 47.2344C24.4795 47.1597 24.4738 47.088 24.42 47.0192C24.3049 46.8757 24.2176 46.7164 24.1581 46.5415C24.0698 46.28 24.137 46.2269 24.3596 46.3822C24.8086 46.6948 25.1781 46.624 25.4678 46.1699C25.7154 45.7827 25.7912 45.8053 25.6953 46.2377C25.5763 46.7724 25.7672 47.1047 26.2681 47.2344C26.3813 47.2619 26.4092 47.3278 26.3516 47.432C26.3382 47.4575 26.3286 47.4831 26.3228 47.5087C26.3132 47.546 26.2902 47.5647 26.2537 47.5647C25.7586 47.5549 25.5273 47.8252 25.56 48.3756C25.5715 48.5486 25.5014 48.5958 25.3498 48.5171C25.1867 48.4306 25.085 48.2852 25.0447 48.0807C25.0178 47.9451 24.9382 47.8881 24.8058 47.9097Z" fill="white"></path><path d="M29.1436 49.0216L28.3577 49.1219C28.2119 49.1415 28.1725 49.0835 28.2397 48.9479L28.6657 48.1223C28.7041 48.0495 28.707 47.9748 28.6744 47.8982L28.3433 47.1285C28.2608 46.9398 28.3097 46.8926 28.4901 46.987C29.2079 47.3684 29.7586 47.218 30.1425 46.5358C30.1568 46.5087 30.1802 46.488 30.2083 46.4777C30.2364 46.4673 30.2673 46.4679 30.2954 46.4794C30.3234 46.4909 30.3467 46.5125 30.361 46.5402C30.3752 46.5679 30.3794 46.5999 30.3728 46.6302C30.2058 47.4126 30.4898 47.9011 31.2248 48.0957C31.4647 48.1586 31.4724 48.2441 31.2479 48.3523L30.4015 48.7562C30.3113 48.7995 30.2586 48.8712 30.2432 48.9715L30.1252 49.7411C30.0964 49.9298 30.0254 49.9485 29.9122 49.7971L29.4084 49.1337C29.3412 49.0452 29.253 49.0079 29.1436 49.0216Z" fill="white"></path><path d="M39.1163 36.7426L38.1318 36.9667L3.19395 44.3357C3.08456 44.3573 3.01931 44.313 2.9982 44.203L0.00155365 29.3118C-0.000521353 29.3013 -0.000518061 29.2905 0.00156463 29.28C0.00364732 29.2696 0.00776726 29.2596 0.0136768 29.2508C0.0195863 29.242 0.0271643 29.2345 0.0359618 29.2288C0.0447592 29.2231 0.054596 29.2192 0.0648837 29.2174L56.768 17.1895C56.8222 17.1781 56.8786 17.1891 56.9249 17.22C56.9712 17.2509 57.0038 17.2993 57.0156 17.3546L59.995 32.1455C60.0161 32.2517 59.9738 32.3166 59.8683 32.3401L39.1163 36.7426ZM41.3789 24.5201C41.3764 24.5083 41.3761 24.496 41.3783 24.4841C41.3804 24.4722 41.3848 24.4609 41.3912 24.4507C41.3976 24.4406 41.4059 24.4319 41.4157 24.425C41.4254 24.4182 41.4364 24.4134 41.448 24.411L44.5569 23.7947C44.5685 23.7922 44.5794 23.7874 44.5892 23.7806C44.5989 23.7738 44.6073 23.7651 44.6137 23.7549C44.6201 23.7448 44.6245 23.7334 44.6266 23.7215C44.6287 23.7096 44.6285 23.6974 44.626 23.6856L44.1683 21.5654C44.1659 21.5536 44.1612 21.5423 44.1546 21.5323C44.1479 21.5224 44.1394 21.5138 44.1295 21.5073C44.1195 21.5007 44.1085 21.4962 44.0968 21.494C44.0852 21.4918 44.0733 21.4921 44.0618 21.4947L35.1409 23.4172C35.1182 23.4222 35.0982 23.4361 35.0853 23.4559C35.0724 23.4758 35.0676 23.5 35.0718 23.5234L35.5094 25.62C35.5142 25.6433 35.5278 25.6637 35.5471 25.6769C35.5665 25.6901 35.5901 25.6951 35.613 25.6907L38.6442 25.0332C38.6671 25.0288 38.6907 25.0337 38.7101 25.047C38.7294 25.0602 38.743 25.0806 38.7478 25.1039L40.711 34.7906C40.7159 34.8139 40.7295 34.8343 40.7488 34.8475C40.7682 34.8607 40.7918 34.8657 40.8147 34.8613L43.3076 34.3276C43.3303 34.3226 43.3503 34.3087 43.3632 34.2889C43.3761 34.2691 43.3809 34.2449 43.3767 34.2215L41.3789 24.5201ZM28.2354 30.9001C28.5295 31.2001 29.1735 31.311 29.6974 31.429C30.61 31.6354 32.9906 31.8035 33.1518 32.98C33.4396 35.0825 29.7464 34.935 28.6064 34.5871C28.5818 34.5793 28.5558 34.5776 28.5303 34.5818C28.5049 34.5861 28.4808 34.5964 28.4599 34.6118C28.439 34.6272 28.4218 34.6474 28.4098 34.6707C28.3978 34.6941 28.3912 34.7199 28.3905 34.7463L28.3358 36.7308C28.332 36.8547 28.3905 36.9284 28.5114 36.952C30.6704 37.3914 35.1812 36.7397 35.7569 34.0327C36.1926 31.9824 35.5449 30.5473 33.8139 29.7276C32.792 29.241 31.2807 29.2027 30.2876 28.837C29.3894 28.5068 29.1908 27.4069 29.9939 26.826C31.0187 26.0859 32.1558 26.4132 33.3821 26.3866C33.5068 26.3847 33.573 26.3198 33.5807 26.192L33.6843 24.3225C33.692 24.2026 33.6373 24.1338 33.5202 24.1161C31.9984 23.8704 30.5342 24.0679 29.1275 24.7088C26.79 25.7703 25.866 28.4331 27.7889 30.4647C27.8522 30.5316 28.2354 30.9001 28.2354 30.9001ZM23.2436 33.7172L23.7157 35.9199C23.754 36.0969 23.6897 36.2148 23.5228 36.2738C16.6227 38.7065 15.0251 27.4895 23.7329 28.5156C23.8423 28.5294 23.8989 28.4802 23.9028 28.3682L23.9747 26.3542C23.9786 26.248 23.9287 26.19 23.825 26.1802C10.5517 24.986 12.8978 44.4123 26.3611 37.5064C26.5645 37.4022 26.6432 37.2351 26.5972 37.0051L25.3968 31.143C25.3845 31.0835 25.3494 31.0316 25.2992 30.9984C25.2491 30.9653 25.1879 30.9536 25.1291 30.966L21.1335 31.8123C21.0165 31.8379 20.9704 31.9096 20.9954 32.0276L21.3581 33.7909C21.3868 33.9285 21.4684 33.9816 21.6027 33.9502L23.0622 33.5993C23.162 33.5757 23.2225 33.615 23.2436 33.7172Z" fill="#1773EA"></path></svg></div><div class="robot-content"><h2 style="font-size: 20px; margin-bottom: 8px; font-weight: 600; color: #000">${text}</h2><p style="color: #000">We are waiting for your action</p></div></div></div>`
}

module.exports = { encrypt_decrypt_str, robotDiv }