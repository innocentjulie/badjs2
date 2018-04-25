/**
 注：badjs得分规则

（1）当报错率 <= 0.5%： badjs得分=100

（2）当 0.5%< 报错率 < 10%：badjs得分： 100 - 10 * 报错率

（3）当报错率 >= 10%： badjs得分=0
 */

var handleScore = function (pv, e_pv) {
    
    // 算分
    var e_rate = e_pv / pv;
    var score;
    if (e_rate <= 0.005) {
        score = 100;
    } else if (e_rate < 0.1 && e_rate > 0.005) {
        score = 100 - 10 * 100 * e_rate;
    } else {
        score = 0;
    }

    return score.toFixed(2);

}
module.exports = {
    handleScore: handleScore
}
