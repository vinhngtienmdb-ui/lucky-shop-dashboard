// Utility to format numbers as VND
const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' đ';
};

const formatPercent = (num) => {
    return (num * 100).toFixed(1) + '%';
};

// Main DOM Elements
const inputs = {
    p_price: document.getElementById('p_price'),
    p_turns: document.getElementById('p_turns'),
    p_resellRate: document.getElementById('p_resellRate'),
    p_dailyLuckyRate: document.getElementById('p_dailyLuckyRate'),
    p_luckyMul: document.getElementById('p_luckyMul'),
    p_newTickets: document.getElementById('p_newTickets'),
    p_b_rate1: document.getElementById('p_b_rate1'),
    p_b_rate2: document.getElementById('p_b_rate2'),
    p_b_rate3: document.getElementById('p_b_rate3'),
    p_b_rate4: document.getElementById('p_b_rate4'),
    p_b_rate5: document.getElementById('p_b_rate5'),
    p_b_rate6: document.getElementById('p_b_rate6'),
    p_b_rate7: document.getElementById('p_b_rate7'),

    c_dist_tgd: document.getElementById('c_dist_tgd'),
    c_rank_tgd: document.getElementById('c_rank_tgd'),
    c_dist_gd: document.getElementById('c_dist_gd'),
    c_rank_gd: document.getElementById('c_rank_gd'),
    c_dist_ql: document.getElementById('c_dist_ql'),
    c_rank_ql: document.getElementById('c_rank_ql'),
    c_dist_nv: document.getElementById('c_dist_nv'),
    c_rank_nv: document.getElementById('c_rank_nv'),
    c_dist_kh: document.getElementById('c_dist_kh'),
    c_rank_kh: document.getElementById('c_rank_kh')
};

// Calculated DOM Elements
const calc = {
    c_groupPrice: document.getElementById('c_groupPrice'),
    c_unitPrice: document.getElementById('c_unitPrice'),
    c_deduction: document.getElementById('c_deduction'),
    c_totalInvest: document.getElementById('c_totalInvest'),
    c_luckyBalance: document.getElementById('c_luckyBalance'),

    c_dist_total: document.getElementById('c_dist_total'),
    c_rank_total: document.getElementById('c_rank_total'),

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

    s_instantRate: document.getElementById('s_instantRate'),
    s_dailyLixi1: document.getElementById('s_dailyLixi1'),
    s_linearDays: document.getElementById('s_linearDays'),
    s_coverRate: document.getElementById('s_coverRate'),
    s_dailyTickets: document.getElementById('s_dailyTickets'),
    s_accLixi: document.getElementById('s_accLixi'),
    s_initialBal: document.getElementById('s_initialBal'),
    s_netDailyLixi1: document.getElementById('s_netDailyLixi1'),
    s_roi: document.getElementById('s_roi'),

    timelineBody: document.getElementById('timelineBody')
};

const formatNumberTable = (num) => new Intl.NumberFormat('vi-VN').format(Math.round(num));

const calculate = () => {
    // Read Table A Inputs
    const price = parseFloat(inputs.p_price.value) || 0;
    const turns = parseFloat(inputs.p_turns.value) || 0;
    const resellRate = (parseFloat(inputs.p_resellRate.value) || 0) / 100;
    const dailyLuckyRate = (parseFloat(inputs.p_dailyLuckyRate.value) || 0) / 100;
    const luckyMul = parseFloat(inputs.p_luckyMul.value) || 0;
    const newTickets = parseFloat(inputs.p_newTickets.value) || 0;

    // Read Table C Inputs
    const d_tgd = (parseFloat(inputs.c_dist_tgd.value) || 0) / 100;
    const r_tgd = (parseFloat(inputs.c_rank_tgd.value) || 0) / 100;
    const d_gd = (parseFloat(inputs.c_dist_gd.value) || 0) / 100;
    const r_gd = (parseFloat(inputs.c_rank_gd.value) || 0) / 100;
    const d_ql = (parseFloat(inputs.c_dist_ql.value) || 0) / 100;
    const r_ql = (parseFloat(inputs.c_rank_ql.value) || 0) / 100;
    const d_nv = (parseFloat(inputs.c_dist_nv.value) || 0) / 100;
    const r_nv = (parseFloat(inputs.c_rank_nv.value) || 0) / 100;
    const d_kh = (parseFloat(inputs.c_dist_kh.value) || 0) / 100;
    const r_kh = (parseFloat(inputs.c_rank_kh.value) || 0) / 100;

    const total_d = d_tgd + d_gd + d_ql + d_nv + d_kh;
    const total_r = r_tgd + r_gd + r_ql + r_nv + r_kh;

    calc.c_dist_total.innerText = formatPercent(total_d);
    calc.c_rank_total.innerText = formatPercent(total_r);

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

    // Update Stats Grid
    calc.s_instantRate.innerText = formatPercent(totalInvest ? instantTotal / totalInvest : 0);
    calc.s_coverRate.innerText = formatPercent(totalInvest ? needToCover / totalInvest : 0);
    calc.s_initialBal.innerText = formatVND(luckyBalance);

    const dailyLixi1 = luckyBalance * dailyLuckyRate;
    calc.s_dailyLixi1.innerText = formatVND(dailyLixi1);
    calc.s_dailyTickets.innerText = formatVND(newTickets);
    
    const netDaily1 = dailyLixi1 - newTickets;
    calc.s_netDailyLixi1.innerText = formatVND(netDaily1);

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
            status = '✅ Đã hòa vốn';
            rowClass = 'row-success';
        } else {
            status = `⏳ Còn thiếu ${formatNumberTable(needToCover - totalCash)}`;
        }

        htmlContent += `
            <tr class="${rowClass}">
                <td>${day}</td>
                <td>${formatNumberTable(currBalance)}</td>
                <td>${formatNumberTable(genLixi)}</td>
                <td>${formatNumberTable(newTickets)}</td>
                <td>${formatNumberTable(commGenerated)}</td>
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
    const roi = totalInvest > 0 ? (totalCash - needToCover) / totalInvest : 0;
    calc.s_roi.innerText = formatPercent(roi);
    if (roi >= 0) {
        calc.s_roi.className = "stat-val text-green";
    } else {
        calc.s_roi.className = "stat-val text-red";
    }
};

// Add event listeners to all inputs to trigger recalculation
Object.values(inputs).forEach(input => {
    if(input) {
        input.addEventListener('input', calculate);
    }
});

// Initial calculation
window.addEventListener('load', calculate);
