/**
 * 测试用例
 */
const Datas: Record<string, any[]> = {
  isSameDay: [
    [new Date('2020-05-01'), '2020/5/1', true],
    [new Date('2020-05-01 23:59:59.999'), '2020/5/2 0:0:0.000', false],
  ],
  compareDate: [
    [new Date('2020/05/01'), '2020/5/1', 0],
    [new Date('2020-05-01'), '2020/5/1', 'h', 8],
    [new Date('2019/01/01'), '2019/3/1', -59],
  ],
  addTime: [[new Date('2020-05-01'), -20, 'd', new Date(2020, 3, 11, 8)]],
  formatDate: [
    [null, ''],
    ['2021-2-1', 'M/d/yyyy', '2/1/2021'],
    ['2021-2-1', 'M/d/yy', '2/1/21'],
  ],
  toDate: [
    [1320940800, new Date(1320940800000)],
    [[2022, 11, 12], new Date(2022, 11, 12)],
  ],
  getDayOfYear: [[1667118460009, 303]],
  getWeekOfYear: [[1667118460009, 45]],
}

export default Datas
