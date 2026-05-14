// Utility to format numbers as VND
const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' đ';
};

const formatPercent = (num) => {
    return (num * 100).toFixed(1) + '%';
};

// --- FIREBASE SETUP ---
// Cấu hình Firebase dự án của bạn
const firebaseConfig = {
    apiKey: "AIzaSyC1VvOXN8vBlOOXgyuKRz4eE0uYj1kfRgk",
    authDomain: "luckyshopanalytics.web.app",
    projectId: "luckyshopanalytics",
    storageBucket: "luckyshopanalytics.firebasestorage.app",
    messagingSenderId: "552187553603",
    appId: "1:552187553603:web:8a8650cd1808420209f1f6",
    measurementId: "G-C42MCG7BLQ"
};

// Khởi tạo Firebase nếu thư viện đã được load
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();

    const btnLogin = document.getElementById('btn_login_admin');
    const btnLogout = document.getElementById('btn_logout_admin');
    const loginModal = document.getElementById('login_modal');
    const btnDoLogin = document.getElementById('btn_do_login');
    const btnDoLoginGoogle = document.getElementById('btn_do_login_google');
    const btnCloseLogin = document.getElementById('btn_close_login');
    const emailInput = document.getElementById('admin_email');
    const pwdInput = document.getElementById('admin_pwd');
    const loginError = document.getElementById('login_error');
    const btnSaveConfig = document.getElementById('btn_save_config');
    const adminToggle = document.getElementById('admin_mode_toggle');

    if (btnLogin) btnLogin.addEventListener('click', () => loginModal.style.display = 'flex');
    if (btnCloseLogin) btnCloseLogin.addEventListener('click', () => {
        loginModal.style.display = 'none';
        loginError.style.display = 'none';
    });

    if (btnDoLogin) {
        btnDoLogin.addEventListener('click', () => {
            const email = emailInput.value;
            const pwd = pwdInput.value;
            auth.signInWithEmailAndPassword(email, pwd)
                .then((result) => {
                    if (result.user && result.user.email !== 'vinh.ngtienmdb@gmail.com') {
                        auth.signOut();
                        loginError.innerText = "Lỗi: Tài khoản không có quyền Admin.";
                        loginError.style.display = 'block';
                    } else {
                        loginModal.style.display = 'none';
                        loginError.style.display = 'none';
                    }
                })
                .catch(error => {
                    loginError.innerText = "Đăng nhập thất bại: " + error.message;
                    loginError.style.display = 'block';
                });
        });
    }

    if (btnDoLoginGoogle) {
        btnDoLoginGoogle.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    if (result.user && result.user.email !== 'vinh.ngtienmdb@gmail.com') {
                        auth.signOut();
                        loginError.innerText = "Lỗi: Tài khoản không có quyền Admin.";
                        loginError.style.display = 'block';
                    } else {
                        loginModal.style.display = 'none';
                        loginError.style.display = 'none';
                    }
                })
                .catch(error => {
                    loginError.innerText = "Đăng nhập thất bại: " + error.message;
                    loginError.style.display = 'block';
                });
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => auth.signOut());
    }

    auth.onAuthStateChanged(user => {
        if (user && user.email === 'vinh.ngtienmdb@gmail.com') {
            if (btnLogin) btnLogin.style.display = 'none';
            if (btnLogout) btnLogout.style.display = 'flex';
            if (adminToggle) {
                adminToggle.checked = true;
                if(typeof toggleAdminMode === 'function') toggleAdminMode();
            }
        } else {
            if (btnLogin) btnLogin.style.display = 'flex';
            if (btnLogout) btnLogout.style.display = 'none';
            if (adminToggle) {
                adminToggle.checked = false;
                if(typeof toggleAdminMode === 'function') toggleAdminMode();
            }
            if (user && user.email !== 'vinh.ngtienmdb@gmail.com') {
                auth.signOut();
            }
        }
    });

    db.collection('configs').doc('main').onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            const setVal = (id, val) => { if(val !== undefined && document.getElementById(id)) document.getElementById(id).value = val; };
            setVal('a_max_tgd', data.a_max_tgd);
            setVal('a_max_gd', data.a_max_gd);
            setVal('a_max_ql', data.a_max_ql);
            setVal('a_max_nv', data.a_max_nv);
            setVal('a_max_direct', data.a_max_direct);
            setVal('a_max_indirect', data.a_max_indirect);
            setVal('p_b_rate1', data.p_b_rate1);
            setVal('p_b_rate2', data.p_b_rate2);
            setVal('p_b_rate3', data.p_b_rate3);
            setVal('p_b_rate4', data.p_b_rate4);
            setVal('p_b_rate5', data.p_b_rate5);
            setVal('p_b_rate6', data.p_b_rate6);
            setVal('p_b_rate7', data.p_b_rate7);
            if(typeof calculate === 'function') calculate();
        }
    });

    if (btnSaveConfig) {
        btnSaveConfig.addEventListener('click', () => {
            if (!auth.currentUser) {
                alert("Bạn cần đăng nhập để lưu cấu hình!");
                return;
            }
            const getVal = (id) => parseFloat(document.getElementById(id).value) || 0;
            const newConfig = {
                a_max_tgd: getVal('a_max_tgd'),
                a_max_gd: getVal('a_max_gd'),
                a_max_ql: getVal('a_max_ql'),
                a_max_nv: getVal('a_max_nv'),
                a_max_direct: getVal('a_max_direct'),
                a_max_indirect: getVal('a_max_indirect'),
                p_b_rate1: getVal('p_b_rate1'),
                p_b_rate2: getVal('p_b_rate2'),
                p_b_rate3: getVal('p_b_rate3'),
                p_b_rate4: getVal('p_b_rate4'),
                p_b_rate5: getVal('p_b_rate5'),
                p_b_rate6: getVal('p_b_rate6'),
                p_b_rate7: getVal('p_b_rate7')
            };

            db.collection('configs').doc('main').set(newConfig, { merge: true })
                .then(() => alert("Lưu cấu hình thành công! Mọi người dùng trên hệ thống sẽ tự động thấy hệ số mới."))
                .catch(err => alert("Lỗi khi lưu: " + err.message));
        });
    }
}
// --- END FIREBASE SETUP ---

// Main DOM Elements
const inputs = {
    p_price: document.getElementById('p_price'),
    p_turns: document.getElementById('p_turns'),
    p_choice_take: document.getElementById('p_choice_take'),
    p_choice_resell: document.getElementById('p_choice_resell'),
    p_dailyLuckyRate: document.getElementById('p_dailyLuckyRate'),
    p_luckyMul: document.getElementById('p_luckyMul'),
    p_b_rate1: document.getElementById('p_b_rate1'),
    p_b_rate2: document.getElementById('p_b_rate2'),
    p_b_rate3: document.getElementById('p_b_rate3'),
    p_b_rate4: document.getElementById('p_b_rate4'),
    p_b_rate5: document.getElementById('p_b_rate5'),
    p_b_rate6: document.getElementById('p_b_rate6'),
    p_b_rate7: document.getElementById('p_b_rate7'),

    admin_mode_toggle: document.getElementById('admin_mode_toggle'),
    u_rank: document.getElementById('u_rank'),
    u_sub_gd: document.getElementById('u_sub_gd'),
    u_sub_ql: document.getElementById('u_sub_ql'),
    u_sub_nv: document.getElementById('u_sub_nv'),
    a_max_nv: document.getElementById('a_max_nv'),
    a_max_ql: document.getElementById('a_max_ql'),
    a_max_gd: document.getElementById('a_max_gd'),
    a_max_tgd: document.getElementById('a_max_tgd'),
    a_max_direct: document.getElementById('a_max_direct'),
    a_max_indirect: document.getElementById('a_max_indirect')
};

// Calculated DOM Elements
const calc = {
    c_groupPrice: document.getElementById('c_groupPrice'),
    c_unitPrice: document.getElementById('c_unitPrice'),
    c_deduction: document.getElementById('c_deduction'),
    c_totalInvest: document.getElementById('c_totalInvest'),
    c_luckyBalance: document.getElementById('c_luckyBalance'),

    // c_dist removed

    b_amt1: document.getElementById('b_amt1'),
    b_amt2: document.getElementById('b_amt2'),
    b_amt3: document.getElementById('b_amt3'),
    b_amt4: document.getElementById('b_amt4'),
    b_amt5: document.getElementById('b_amt5'),
    b_amt6: document.getElementById('b_amt6'),
    b_amt7: document.getElementById('b_amt7'),
    b_resellRate: document.getElementById('b_resellRate'),
    
    b_totalHH: document.getElementById('b_totalHH'),
    b_resellAmt: document.getElementById('b_resellAmt'),
    b_capitalReturned: document.getElementById('b_capitalReturned'),
    b_instantTotal: document.getElementById('b_instantTotal'),
    b_needToCover: document.getElementById('b_needToCover'),

    d_totalInvest: document.getElementById('d_totalInvest'),
    d_resellReturn: document.getElementById('d_resellReturn'),
    d_totalHH: document.getElementById('d_totalHH'),
    d_needToCover: document.getElementById('d_needToCover'),

    s_dailyLixi1: document.getElementById('s_dailyLixi1'),
    s_linearDays: document.getElementById('s_linearDays'),
    s_accLixi: document.getElementById('s_accLixi'),
    s_initialBal: document.getElementById('s_initialBal'),
    s_roi: document.getElementById('s_roi'),

    timelineBody: document.getElementById('timelineBody')
};

const formatNumberTable = (num) => new Intl.NumberFormat('vi-VN').format(Math.round(num));

const calculate = () => {
    // Read Table A Inputs
    const priceStr = inputs.p_price.value.replace(/\./g, '');
    const price = parseFloat(priceStr) || 0;
    const turns = parseFloat(inputs.p_turns.value) || 0;
    const isTake = inputs.p_choice_take && inputs.p_choice_take.checked;
    const resellRate = isTake ? 0 : 0.8;
    const dailyLuckyRate = (parseFloat(inputs.p_dailyLuckyRate.value) || 0) / 100;
    const luckyMul = parseFloat(inputs.p_luckyMul.value) || 0;
    const newTickets = 0;

    const isAdmin = inputs.admin_mode_toggle && inputs.admin_mode_toggle.checked;

    if (!isAdmin && inputs.u_rank) {
        // User Mode logic
        const rank = inputs.u_rank.value;
        
        let r1 = 0, r2 = 0, r3 = 0, r4 = 0, r5 = 0, r6 = 0, r7 = 0;
        
        // Distribution commissions are always given in User Mode
        r2 = parseFloat(inputs.a_max_direct.value) || 0;
        r3 = parseFloat(inputs.a_max_indirect.value) || 0;
        
        // Rank commissions
        const max_nv = parseFloat(inputs.a_max_nv.value) || 0;
        const max_ql = parseFloat(inputs.a_max_ql.value) || 0;
        const max_gd = parseFloat(inputs.a_max_gd.value) || 0;
        const max_tgd = parseFloat(inputs.a_max_tgd.value) || 0;
        
        let rankTarget = 0; // 4=nv, 5=ql, 6=gd, 7=tgd
        if (rank === 'nv') rankTarget = 4;
        else if (rank === 'ql') rankTarget = 5;
        else if (rank === 'gd') rankTarget = 6;
        else if (rank === 'tgd') rankTarget = 7;
        
        // Build the chain of participating ranks
        let participatingRanks = [];
        if (rankTarget >= 4) participatingRanks.push({ id: 4, max: max_nv, active: (rankTarget === 4 || inputs.u_sub_nv.checked) });
        if (rankTarget >= 5) participatingRanks.push({ id: 5, max: max_ql, active: (rankTarget === 5 || inputs.u_sub_ql.checked) });
        if (rankTarget >= 6) participatingRanks.push({ id: 6, max: max_gd, active: (rankTarget === 6 || inputs.u_sub_gd.checked) });
        if (rankTarget >= 7) participatingRanks.push({ id: 7, max: max_tgd, active: (rankTarget === 7) });

        // Calculate differential commissions from bottom to top
        let currentDeduction = 0;
        for (let i = 0; i < participatingRanks.length; i++) {
            let p = participatingRanks[i];
            if (p.active) {
                let commission = Math.max(0, p.max - currentDeduction);
                if (p.id === 4) r4 = commission;
                if (p.id === 5) r5 = commission;
                if (p.id === 6) r6 = commission;
                if (p.id === 7) r7 = commission;
                currentDeduction = p.max; // The next active rank above will deduct this
            }
        }
        
        // Update the inputs and display spans so UI reflects them
        inputs.p_b_rate1.value = r1; const d1 = document.getElementById('d_b_rate1'); if(d1) d1.innerText = r1 + '%';
        inputs.p_b_rate2.value = r2; const d2 = document.getElementById('d_b_rate2'); if(d2) d2.innerText = r2 + '%';
        inputs.p_b_rate3.value = r3; const d3 = document.getElementById('d_b_rate3'); if(d3) d3.innerText = r3 + '%';
        inputs.p_b_rate4.value = r4; const d4 = document.getElementById('d_b_rate4'); if(d4) d4.innerText = r4 + '%';
        inputs.p_b_rate5.value = r5; const d5 = document.getElementById('d_b_rate5'); if(d5) d5.innerText = r5 + '%';
        inputs.p_b_rate6.value = r6; const d6 = document.getElementById('d_b_rate6'); if(d6) d6.innerText = r6 + '%';
        inputs.p_b_rate7.value = r7; const d7 = document.getElementById('d_b_rate7'); if(d7) d7.innerText = r7 + '%';
    }

    // Calculate Table A
    const unitPrice = price / 5;
    const groupPrice = turns * unitPrice;
    const deduction = groupPrice / 2;
    const totalInvest = groupPrice + deduction;
    const luckyBalance = deduction * luckyMul;

    calc.c_groupPrice.innerText = formatNumberTable(groupPrice);
    calc.c_unitPrice.innerText = formatNumberTable(unitPrice);
    calc.c_deduction.innerText = formatNumberTable(deduction);
    calc.c_totalInvest.innerText = formatNumberTable(totalInvest);
    calc.c_luckyBalance.innerText = formatNumberTable(luckyBalance);

    // Calculate Table B using its own inputs
    const r1 = (parseFloat(inputs.p_b_rate1.value) || 0) / 100;
    const r2 = (parseFloat(inputs.p_b_rate2.value) || 0) / 100;
    const r3 = (parseFloat(inputs.p_b_rate3.value) || 0) / 100;
    const r4 = (parseFloat(inputs.p_b_rate4.value) || 0) / 100;
    const r5 = (parseFloat(inputs.p_b_rate5.value) || 0) / 100;
    const r6 = (parseFloat(inputs.p_b_rate6.value) || 0) / 100;
    const r7 = (parseFloat(inputs.p_b_rate7.value) || 0) / 100;

    const a1 = deduction * r1;
    const a2 = deduction * r2;
    const a3 = deduction * r3;
    const a4 = deduction * r4;
    const a5 = deduction * r5;
    const a6 = deduction * r6;
    const a7 = deduction * r7;

    calc.b_amt1.innerText = formatNumberTable(a1);
    calc.b_amt2.innerText = formatNumberTable(a2);
    calc.b_amt3.innerText = formatNumberTable(a3);
    calc.b_amt4.innerText = formatNumberTable(a4);
    calc.b_amt5.innerText = formatNumberTable(a5);
    calc.b_amt6.innerText = formatNumberTable(a6);
    calc.b_amt7.innerText = formatNumberTable(a7);

    const totalHH = a1 + a2 + a3 + a4 + a5 + a6 + a7;
    calc.b_totalHH.innerText = formatNumberTable(totalHH);

    calc.b_resellRate.innerText = formatPercent(resellRate);
    const resellAmt = price * resellRate;
    calc.b_resellAmt.innerText = formatNumberTable(resellAmt);

    const capitalReturned = groupPrice - unitPrice;
    calc.b_capitalReturned.innerText = formatNumberTable(capitalReturned);

    const instantTotal = totalHH + resellAmt;
    calc.b_instantTotal.innerText = formatNumberTable(instantTotal);

    const needToCover = totalInvest - totalHH - resellAmt - capitalReturned;
    calc.b_needToCover.innerText = formatNumberTable(needToCover);

    // Update Dashboard Cards
    calc.d_totalInvest.innerText = formatVND(totalInvest);
    calc.d_resellReturn.innerText = formatVND(resellAmt);
    calc.d_totalHH.innerText = formatVND(totalHH);
    calc.d_needToCover.innerText = formatVND(needToCover);

    // Update UI Stats
    calc.s_initialBal.innerText = formatVND(luckyBalance);

    const dailyLixi1 = luckyBalance * dailyLuckyRate;
    calc.s_dailyLixi1.innerText = formatVND(dailyLixi1);

    const netDaily1 = dailyLixi1 - newTickets;

    if (netDaily1 > 0) {
        const daysToCover = Math.ceil(needToCover / netDaily1);
        calc.s_linearDays.innerText = `Khoảng ${daysToCover} ngày`;
        calc.s_linearDays.className = "stat-val text-green";
    } else {
        calc.s_linearDays.innerText = "Không thể đạt";
        calc.s_linearDays.className = "stat-val text-red";
    }

    // Timeline Loop 365 Days
    let currBalance = luckyBalance;
    let totalCash = 0;
    let htmlContent = '';
    const total_commission_rate = r1 + r2 + r3 + r4 + r5 + r6 + r7;

    for (let day = 1; day <= 365; day++) {
        const genLixi = currBalance * dailyLuckyRate;
        const commGenerated = newTickets * total_commission_rate;
        const cashToday = genLixi - newTickets - commGenerated;
        
        totalCash += cashToday;
        const endBalance = currBalance - genLixi;

        let status = '';
        let rowClass = '';
        if (totalCash >= needToCover) {
            const profit = totalCash - needToCover;
            status = `✅ Đã hòa vốn (Lãi: ${formatNumberTable(profit)})`;
            rowClass = 'row-success';
        } else {
            status = `⏳ Còn thiếu ${formatNumberTable(needToCover - totalCash)}`;
        }

        htmlContent += `
            <tr class="${rowClass}">
                <td>${day}</td>
                <td>${formatNumberTable(currBalance)}</td>
                <td>${formatNumberTable(genLixi)}</td>
                <td>${formatNumberTable(totalCash)}</td>
                <td>${formatNumberTable(endBalance)}</td>
                <td style="text-align: left;">${status}</td>
            </tr>
        `;
        currBalance = endBalance;
    }

    calc.timelineBody.innerHTML = htmlContent;

    // Post-loop stats
    calc.s_accLixi.innerText = formatVND(totalCash);
    const roi = needToCover > 0 ? (totalCash - needToCover) / needToCover : 0;
    calc.s_roi.innerText = formatPercent(roi);
    if (roi >= 0) {
        calc.s_roi.className = "stat-val text-green";
    } else {
        calc.s_roi.className = "stat-val text-red";
    }
};

// UI Logic for User Mode
const updateSubordinateVisibility = () => {
    if (!inputs.u_rank) return;
    const rank = inputs.u_rank.value;
    const gdChk = document.getElementById('u_chk_gd');
    const qlChk = document.getElementById('u_chk_ql');
    const nvChk = document.getElementById('u_chk_nv');
    
    if(rank === 'tgd') {
        gdChk.style.display = 'block';
        qlChk.style.display = 'block';
        nvChk.style.display = 'block';
    } else if (rank === 'gd') {
        gdChk.style.display = 'none'; inputs.u_sub_gd.checked = false;
        qlChk.style.display = 'block';
        nvChk.style.display = 'block';
    } else if (rank === 'ql') {
        gdChk.style.display = 'none'; inputs.u_sub_gd.checked = false;
        qlChk.style.display = 'none'; inputs.u_sub_ql.checked = false;
        nvChk.style.display = 'block';
    } else {
        gdChk.style.display = 'none'; inputs.u_sub_gd.checked = false;
        qlChk.style.display = 'none'; inputs.u_sub_ql.checked = false;
        nvChk.style.display = 'none'; inputs.u_sub_nv.checked = false;
    }
    calculate();
};

const toggleAdminMode = () => {
    if (!inputs.admin_mode_toggle) return;
    const isAdmin = inputs.admin_mode_toggle.checked;
    const adminCards = document.querySelectorAll('.admin-only-card');
    const userCards = document.querySelectorAll('.user-only-card');
    
    adminCards.forEach(c => c.style.display = isAdmin ? 'block' : 'none');
    userCards.forEach(c => c.style.display = isAdmin ? 'none' : 'block');
    
    // Toggle Card B inputs vs display spans
    const adminInputs = document.querySelectorAll('.admin-input-only');
    const userDisplays = document.querySelectorAll('.user-display-only');
    
    adminInputs.forEach(el => el.style.display = isAdmin ? 'block' : 'none');
    userDisplays.forEach(el => el.style.display = isAdmin ? 'none' : 'block');
    
    calculate();
};

// Add event listeners to all inputs to trigger recalculation
Object.values(inputs).forEach(input => {
    if(input && input.tagName) {
        input.addEventListener('input', calculate);
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.addEventListener('change', calculate);
        }
    }
});

// Specific event listeners
if (inputs.admin_mode_toggle) inputs.admin_mode_toggle.addEventListener('change', toggleAdminMode);
if (inputs.u_rank) inputs.u_rank.addEventListener('change', updateSubordinateVisibility);

if (inputs.p_price) {
    inputs.p_price.addEventListener('input', function(e) {
        let val = e.target.value.replace(/\D/g, '');
        if (val !== '') {
            e.target.value = new Intl.NumberFormat('vi-VN').format(parseInt(val, 10));
        } else {
            e.target.value = '';
        }
        calculate();
    });
}

// Initial setup
window.addEventListener('load', () => {
    if (inputs.u_rank) updateSubordinateVisibility();
    if (inputs.admin_mode_toggle) toggleAdminMode();
    calculate();
});
