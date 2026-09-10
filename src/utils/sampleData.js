export const SAMPLE_PROBLEMS = [
  {
    id: 'sample_1',
    title: 'Bài toán Khu vườn hình chữ nhật (Hình học & Đại số Lớp 9)',
    grade: 'Lớp 9',
    domain: 'Đại số & Hình học',
    text: `Một khu vườn hình chữ nhật có chiều dài hơn chiều rộng 8m. Biết diện tích khu vườn là 240 m². 
1) Tính chiều dài và chiều rộng của khu vườn.
2) Người ta muốn làm một lối đi xung quanh khu vườn rộng 1m bên trong đất vườn. Tính diện tích phần đất còn lại để trồng hoa.`
  },
  {
    id: 'sample_2',
    title: 'Bài toán Tháp nước công cộng & Thể tích khối tròn xoay (STEM & Hình học 12)',
    grade: 'Lớp 12',
    domain: 'Hình học & STEM',
    text: `Một bể nước cứu hỏa của xã có dạng khối nón có bán kính đáy R = 3m và chiều cao h = 4m. 
1) Tính thể tích nước tối đa mà bể có thể chứa.
2) Người ta thiết kế một máy bơm nước vào bể với tốc độ 2 m³/phút. Hỏi sau bao lâu kể từ khi bể trống thì nước bơm đầy 80% thể tích bể?`
  },
  {
    id: 'sample_3',
    title: 'Bài toán Tài chính & Tiết kiệm tích lũy (Toán Tài chính Lớp 10-11)',
    grade: 'Lớp 11',
    domain: 'Toán tài chính',
    text: `Bác An gửi tiết kiệm số tiền 200 triệu đồng vào ngân hàng theo hình thức lãi gộp với lãi suất 6,5%/năm.
1) Hỏi sau 3 năm, tổng số tiền cả gốc và lãi bác An nhận được là bao nhiêu?
2) Nếu bác An muốn nhận được tổng cộng 300 triệu đồng thì cần gửi ít nhất bao nhiêu năm?`
  }
];

export const INITIAL_OPTIONS = {
  grade: 'Lớp 9',
  domain: 'Tự động nhận diện',
  difficulty: 'Vận dụng',
  format: 'Trắc nghiệm nhiều lựa chọn',
  context: 'Ngữ cảnh Việt Nam',
  creativeLevel: 'Sáng tạo đa dạng nhưng giữ kiến thức cốt lõi',
  imageStyle: 'Ảnh thực tế giáo dục',
};

export const SAMPLE_10_PROBLEMS = [
  {
    id: 1,
    title: 'Câu 1: Tính kích thước khu vườn trồng hoa chữ nhật',
    questionFormat: 'Trắc nghiệm nhiều lựa chọn',
    contextTag: 'Hình học & Nông nghiệp STEM',
    difficulty: 'Vận dụng',
    statement: 'Một mảnh vườn hình chữ nhật có chiều dài hơn chiều rộng 8m. Biết diện tích mảnh vườn là $240\\text{ m}^2$. Chiều dài và chiều rộng của mảnh vườn lần lượt là bao nhiêu?',
    options: ['A. 20m và 12m', 'B. 24m và 16m', 'C. 18m và 10m', 'D. 22m và 14m'],
    correctOption: 'A',
    shortAnswer: 'Chiều dài 20m, chiều rộng 12m',
    detailedSolution: 'Gọi chiều rộng mảnh vườn là $x$ (m, $x > 0$). Chiều dài mảnh vườn là $x + 8$ (m).\nTheo đề bài, diện tích mảnh vườn là:\n$$x(x + 8) = 240 \\iff x^2 + 8x - 240 = 0$$\nGiải phương trình bậc hai thu được $x = 12$ (thỏa mãn) hoặc $x = -20$ (loại).\nVậy chiều rộng là $12\\text{m}$ và chiều dài là $12 + 8 = 20\\text{m}$. Chọn A.',
    imagePrompt: 'Isometric 3D view of a rectangular flower garden with colorful tulips, neat stone pathway around it, realistic educational diagram with dimensions labeled 20m and 12m',
    tikzCode: `\\begin{tikzpicture}[scale=0.8]
  \\draw[thick, fill=green!15] (0,0) rectangle (6,4);
  \\draw[dashed, fill=orange!10] (0.5,0.5) rectangle (5.5,3.5);
  \\node[below, font=\\small] at (3,0) {Chiều dài $x + 8 = 20\\text{ m}$};
  \\node[left, font=\\small] at (0,2) {Chiều rộng $x = 12\\text{ m}$};
  \\node[font=\\bfseries] at (3,2) {$S = 240\\text{ m}^2$};
\\end{tikzpicture}`
  },
  {
    id: 2,
    title: 'Câu 2: Thể tích bể nước cứu hỏa khối nón',
    questionFormat: 'Tự luận ngắn',
    contextTag: 'Hình học không gian & Cứu hỏa STEM',
    difficulty: 'Vận dụng',
    statement: 'Một bể chứa nước cứu hỏa có dạng khối nón úp ngược với bán kính đáy $R = 3\\text{ m}$ và chiều cao $h = 4\\text{ m}$. Tính thể tích nước tối đa mà bể có thể chứa (lấy $\\pi \\approx 3{,}14$).',
    options: ['A. $37{,}68\\text{ m}^3$', 'B. $113{,}04\\text{ m}^3$', 'C. $50{,}24\\text{ m}^3$', 'D. $75{,}36\\text{ m}^3$'],
    correctOption: 'A',
    shortAnswer: '37,68 m³',
    detailedSolution: 'Thể tích khối nón được tính theo công thức:\n$$V = \\frac{1}{3} \\pi R^2 h = \\frac{1}{3} \\times 3{,}14 \\times 3^2 \\times 4 = 37{,}68\\text{ m}^3$$\nVậy bể chứa được tối đa $37{,}68\\text{ m}^3$ nước. Chọn A.',
    imagePrompt: '3D render of an inverted conical water reservoir for firefighting in a rural village, clean blue water inside, scientific diagram style with labels R=3m and h=4m',
    tikzCode: `\\begin{tikzpicture}[scale=0.8]
  \\draw[thick, fill=blue!10] (0,4) -- (-2.5,4) arc(180:360:2.5cm and 0.6cm) -- cycle;
  \\draw[dashed] (-2.5,4) arc(180:0:2.5cm and 0.6cm);
  \\draw[thick] (-2.5,4) -- (0,0) -- (2.5,4);
  \\draw[dashed, red, thick] (0,4) -- (0,0) node[midway, right] {$h = 4\\text{ m}$};
  \\draw[dashed, blue, thick] (0,4) -- (2.5,4) node[midway, above] {$R = 3\\text{ m}$};
\\end{tikzpicture}`
  },
  {
    id: 3,
    title: 'Câu 3: Lãi suất tiết kiệm tích lũy ngân hàng',
    questionFormat: 'Trắc nghiệm nhiều lựa chọn',
    contextTag: 'Toán Tài chính & Quản lý chi tiêu',
    difficulty: 'Thông hiểu',
    statement: 'Bác An gửi tiết kiệm số tiền $200$ triệu đồng vào ngân hàng với lãi suất $6{,}5\\%/\\text{năm}$ theo hình thức lãi gộp hàng năm. Sau 3 năm, tổng số tiền bác An nhận được (cả gốc lẫn lãi) là bao nhiêu?',
    options: ['A. $241{,}58$ triệu đồng', 'B. $239{,}00$ triệu đồng', 'C. $250{,}20$ triệu đồng', 'D. $213{,}00$ triệu đồng'],
    correctOption: 'A',
    shortAnswer: '241,58 triệu đồng',
    detailedSolution: 'Áp dụng công thức lãi gộp $A = P(1 + r)^n$ với $P = 200$, $r = 6{,}5\\% = 0{,}065$, $n = 3$:\n$$A = 200 \\times (1 + 0{,}065)^3 = 200 \\times (1{,}065)^3 \\approx 241{,}58\\text{ triệu đồng}$$\nChọn A.',
    imagePrompt: 'Financial bar chart showing compound interest growth over 3 years, bank piggy bank with gold coins, modern vector graphics style',
    tikzCode: `\\begin{tikzpicture}[scale=0.75]
  \\draw[->, thick] (0,0) -- (5,0) node[right] {Năm};
  \\draw[->, thick] (0,0) -- (0,4.5) node[above] {Số tiền (Trđ)};
  \\draw[fill=blue!40] (0.6,0) rectangle (1.4,2.0) node[above] {200};
  \\draw[fill=blue!55] (1.8,0) rectangle (2.6,2.26) node[above] {213};
  \\draw[fill=blue!70] (3.0,0) rectangle (3.8,2.54) node[above] {226.8};
  \\draw[fill=blue!85, text=white] (4.2,0) rectangle (5.0,2.83);
  \\node[above, font=\\small] at (4.6,2.83) {241.6};
  \\node[below] at (1,0) {0};
  \\node[below] at (2.2,0) {1};
  \\node[below] at (3.4,0) {2};
  \\node[below] at (4.6,0) {3};
\\end{tikzpicture}`
  },
  {
    id: 4,
    title: 'Câu 4: Quãng đường phanh xe ô tô an toàn',
    questionFormat: 'Trắc nghiệm',
    contextTag: 'Vật lý & Giao thông đường bộ STEM',
    difficulty: 'Vận dụng cao',
    statement: 'Quãng đường phanh $d$ (tính bằng mét) của một ô tô chuyển động với vận tốc $v$ (km/h) được cho bởi công thức $d = 0{,}006 v^2 + 0{,}2 v$. Nếu một xe ô tô phanh gấp và dừng lại sau quãng đường $44\\text{m}$, vận tốc ban đầu của xe là bao nhiêu?',
    options: ['A. $70\\text{ km/h}$', 'B. $60\\text{ km/h}$', 'C. $80\\text{ km/h}$', 'D. $50\\text{ km/h}$'],
    correctOption: 'B',
    shortAnswer: '60 km/h',
    detailedSolution: 'Thay $d = 44$ vào công thức:\n$$0{,}006 v^2 + 0{,}2 v = 44 \\iff 0{,}006 v^2 + 0{,}2 v - 44 = 0$$\nGiải phương trình bậc hai thu được $v = 60$ (km/h). Chọn B.',
    imagePrompt: 'Educational illustration of a car braking safely on an asphalt road with skid marks, distance 44m marked on road, speed meter showing 60 km/h',
    tikzCode: `\\begin{tikzpicture}[scale=0.8]
  \\draw[line width=2pt] (0,0) -- (7,0);
  \\draw[dashed, red, thick] (1,0.2) -- (6,0.2) node[midway, above] {$d = 44\\text{ m}$};
  \\draw[fill=gray!30] (0.5,0.2) rectangle (1.5,0.8);
  \\node at (1,0.5) {Ô tô};
  \\draw[fill=red!60] (5.5,0.2) rectangle (6.5,0.8);
  \\node[white] at (6,0.5) {Dừng};
\\end{tikzpicture}`
  },
  {
    id: 5,
    title: 'Câu 5: Tối ưu hóa chi phí sản xuất hộp sữa tươi',
    questionFormat: 'Tự luận',
    contextTag: 'Công nghiệp Thực phẩm & Hộp giấy 3D',
    difficulty: 'Vận dụng cao',
    statement: 'Một công ty thực phẩm muốn thiết kế một vỏ hộp sữa hình hộp chữ nhật đáy vuông dung tích $1000\\text{ cm}^3$ ($1\\text{ lít}$) sao cho tổng diện tích vật liệu làm vỏ hộp là nhỏ nhất. Tính chiều cao của hộp sữa.',
    options: ['A. $10\\text{ cm}$', 'B. $12\\text{ cm}$', 'C. $8\\text{ cm}$', 'D. $15\\text{ cm}$'],
    correctOption: 'A',
    shortAnswer: '10 cm',
    detailedSolution: 'Gọi cạnh đáy vuông là $x$ (cm) và chiều cao là $h$ (cm).\nThể tích $V = x^2 h = 1000 \\implies h = \\frac{1000}{x^2}$.\nDiện tích toàn phần $S = 2x^2 + 4xh = 2x^2 + \\frac{4000}{x}$.\nÁp dụng BĐT AM-GM: $S = 2x^2 + \\frac{2000}{x} + \\frac{2000}{x} \\ge 3 \\sqrt[3]{2x^2 \\cdot \\frac{2000}{x} \\cdot \\frac{2000}{x}} = 600\\text{ cm}^2$.\nDấu "=" xảy ra khi $2x^2 = \\frac{2000}{x} \\implies x = 10\\text{ cm} \\implies h = 10\\text{ cm}$. Chọn A.',
    imagePrompt: 'Clean 3D render of a modern milk carton with square base, labeled dimensions x=10cm and h=10cm, volume 1 liter, studio lighting',
    tikzCode: `\\begin{tikzpicture}[scale=0.7]
  \\draw[thick, fill=blue!10] (0,0) rectangle (2.5,3.5);
  \\draw[thick, fill=blue!20] (2.5,0) -- (3.5,1) -- (3.5,4.5) -- (2.5,3.5) -- cycle;
  \\draw[thick, fill=blue!15] (0,3.5) -- (1,4.5) -- (3.5,4.5) -- (2.5,3.5) -- cycle;
  \\node[below] at (1.25,0) {$x = 10\\text{ cm}$};
  \\node[right] at (3.5,2.75) {$h = 10\\text{ cm}$};
  \\node at (1.25,1.75) {$1\\text{ Lít}$};
\\end{tikzpicture}`
  },
  {
    id: 6,
    title: 'Câu 6: Chiều cao cây bóng râm đo bằng lượng giác',
    questionFormat: 'Trắc nghiệm',
    contextTag: 'Đo đạc Thực địa & Tam giác vuông',
    difficulty: 'Nhận biết',
    statement: 'Một người đứng cách gốc cây $15\\text{ m}$ nhìn lên đỉnh cây dưới một góc nâng $35^\\circ$. Biết khoảng cách từ mắt người đó đến mặt đất là $1{,}6\\text{ m}$. Chiều cao của cây gần nhất với giá trị nào?',
    options: ['A. $12{,}1\\text{ m}$', 'B. $10{,}5\\text{ m}$', 'C. $14{,}2\\text{ m}$', 'D. $16{,}8\\text{ m}$'],
    correctOption: 'A',
    shortAnswer: '12,1 m',
    detailedSolution: 'Gọi chiều cao phần cây từ tầm mắt lên đỉnh là $h_1$.\n$h_1 = 15 \\cdot \\tan(35^\\circ) \\approx 15 \\cdot 0{,}7002 = 10{,}5\\text{ m}$.\nChiều cao toàn bộ cây $H = h_1 + 1{,}6 = 10{,}5 + 1{,}6 = 12{,}1\\text{ m}$. Chọn A.',
    imagePrompt: 'Educational diagram showing a person standing 15m from a tall tree, measuring height using trigonometry, angle of elevation 35 degrees labeled',
    tikzCode: `\\begin{tikzpicture}[scale=0.6]
  \\draw[thick] (0,0) -- (8,0);
  \\draw[thick, fill=green!40] (8,0) -- (8,6) node[above] {Đỉnh cây};
  \\draw[dashed] (1,1) -- (8,1);
  \\draw[thick, red] (1,1) -- (8,6);
  \\node[left] at (1,0.5) {$1.6\\text{m}$};
  \\node[below] at (4.5,0) {$15\\text{ m}$};
  \\draw (2,1) arc(0:35:1) node[midway, right] {$35^\\circ$};
\\end{tikzpicture}`
  },
  {
    id: 7,
    title: 'Câu 7: Tốc độ tăng trưởng dân số theo hàm mũ',
    questionFormat: 'Trắc nghiệm',
    contextTag: 'Thống kê Dân số & Hàm số Mũ',
    difficulty: 'Vận dụng',
    statement: 'Dân số một thành phố được tính theo công thức $N(t) = N_0 \\cdot e^{rt}$, trong đó $N_0$ là dân số ban đầu, $r = 1{,}2\\%/\\text{năm}$ là tỉ lệ tăng dân số. Nếu năm 2020 dân số là $1$ triệu người, dự báo đến năm 2030 dân số thành phố là bao nhiêu?',
    options: ['A. $1{,}127$ triệu người', 'B. $1{,}250$ triệu người', 'C. $1{,}050$ triệu người', 'D. $1{,}310$ triệu người'],
    correctOption: 'A',
    shortAnswer: '1,127 triệu người',
    detailedSolution: 'Khoảng thời gian $t = 2030 - 2020 = 10\\text{ năm}$.\n$$N(10) = 1 \\cdot e^{0{,}012 \\times 10} = e^{0{,}12} \\approx 1{,}1275\\text{ triệu người}$$\nChọn A.',
    imagePrompt: 'Exponential growth curve graph representing population growth from 2020 to 2030, clean infographics background',
    tikzCode: `\\begin{tikzpicture}[scale=0.7]
  \\draw[->, thick] (0,0) -- (6,0) node[right] {Năm};
  \\draw[->, thick] (0,0) -- (0,4) node[above] {Dân số (tr người)};
  \\draw[domain=0:5, smooth, variable=\\x, blue, ultra thick] plot ({\\x}, {1.5*exp(0.15*\\x)});
  \\node[below] at (0,0) {2020};
  \\node[below] at (5,0) {2030};
  \\draw[dashed] (5,0) -- (5,3.17) -- (0,3.17) node[left] {1.127};
\\end{tikzpicture}`
  },
  {
    id: 8,
    title: 'Câu 8: Năng suất thu hoạch lúa vụ hè thu',
    questionFormat: 'Trả lời ngắn',
    contextTag: 'Nông nghiệp Thực tế & Đại số 9',
    difficulty: 'Thông hiểu',
    statement: 'Hai đội hợp tác xã cùng gặt một thửa ruộng. Nếu làm chung thì sau 4 giờ xong. Nếu làm riêng thì đội I làm xong nhanh hơn đội II là 6 giờ. Hỏi đội I làm riêng thì sau bao lâu xong thửa ruộng?',
    options: ['A. 6 giờ', 'B. 12 giờ', 'C. 8 giờ', 'D. 10 giờ'],
    correctOption: 'A',
    shortAnswer: '6 giờ',
    detailedSolution: 'Gọi thời gian đội I làm riêng xong là $x$ giờ ($x > 4$). Đội II làm riêng xong trong $x + 6$ giờ.\nPhương trình năng suất:\n$$\\frac{1}{x} + \\frac{1}{x+6} = \\frac{1}{4} \\iff 4(2x+6) = x(x+6) \\iff x^2 - 2x - 24 = 0$$\nGiải ra $x = 6$ (thỏa mãn) hoặc $x = -4$ (loại). Vậy đội I làm riêng trong 6 giờ. Chọn A.',
    imagePrompt: 'Illustration of two modern combine harvesters working in a golden rice field in Vietnam, sunny sky, agriculture STEM concept',
    tikzCode: `\\begin{tikzpicture}[scale=0.7]
  \\draw[fill=yellow!30] (0,0) rectangle (6,3);
  \\node at (3,1.5) {Thửa ruộng $100\\%$};
  \\draw[thick, red, ->] (0.5,3.3) -- (3,3.3) node[midway, above] {Đội I (6h)};
  \\draw[thick, blue, ->] (3.5,3.3) -- (5.5,3.3) node[midway, above] {Đội II (12h)};
\\end{tikzpicture}`
  },
  {
    id: 9,
    title: 'Câu 9: Thiết kế cầu treo dây văng parabol',
    questionFormat: 'Tự luận',
    contextTag: 'Công trình Giao thông & Parabol Hướng trục',
    difficulty: 'Vận dụng cao',
    statement: 'Dây cáp của một cầu treo có dạng Parabol $y = a x^2$. Hai tháp cổng cầu cách nhau $200\\text{ m}$ và cao $30\\text{ m}$ so với mặt cầu. Dây cáp chạm mặt cầu tại tâm $O$. Tính chiều dài dây cáp treo tại vị trí cách tâm cầu $50\\text{ m}$.',
    options: ['A. $7{,}5\\text{ m}$', 'B. $15\\text{ m}$', 'C. $10\\text{ m}$', 'D. $12{,}5\\text{ m}$'],
    correctOption: 'A',
    shortAnswer: '7,5 m',
    detailedSolution: 'Hệ trục tọa độ $Oxy$ tại đỉnh parabol $O(0,0)$. Tháp cầu tại $A(100, 30)$.\nPhương trình parabol: $30 = a \\cdot 100^2 \\implies a = \\frac{30}{10000} = 0{,}003$.\nTại điểm cách tâm $50\\text{ m}$: $y = 0{,}003 \\times 50^2 = 0{,}003 \\times 2500 = 7{,}5\\text{ m}$. Chọn A.',
    imagePrompt: '3D architectural render of a cable-stayed suspension bridge with parabolic main cable, blue water below, dimensions 200m span labeled',
    tikzCode: `\\begin{tikzpicture}[scale=0.8]
  \\draw[domain=-3:3, smooth, variable=\\x, red, ultra thick] plot ({\\x}, {0.3*\\x*\\x});
  \\draw[thick] (-3,0) -- (3,0) node[right] {Mặt cầu};
  \\draw[thick] (-3,0) -- (-3,2.7) node[above] {Tháp 30m};
  \\draw[thick] (3,0) -- (3,2.7) node[above] {Tháp 30m};
  \\draw[dashed, blue] (1.5,0) -- (1.5,0.675) node[midway, right] {$7.5\\text{m}$};
  \\node[below] at (0,0) {$O$};
\\end{tikzpicture}`
  },
  {
    id: 10,
    title: 'Câu 10: Tần số xuất hiện biến cố xác suất xúc xắc',
    questionFormat: 'Trắc nghiệm',
    contextTag: 'Xác suất & Trò chơi Học tập STEM',
    difficulty: 'Nhận biết',
    statement: 'Gieo một con xúc xắc cân đối và đồng chất 2 lần. Xác suất để tổng số chấm xuất hiện trên 2 lần gieo bằng 7 là bao nhiêu?',
    options: ['A. $\\frac{1}{6}$', 'B. $\\frac{1}{12}$', 'C. $\\frac{5}{36}$', 'D. $\\frac{1}{36}$'],
    correctOption: 'A',
    shortAnswer: '1/6',
    detailedSolution: 'Số phần tử không gian mẫu $n(\\Omega) = 6 \\times 6 = 36$.\nCác cặp $(a,b)$ có tổng $a+b=7$ là: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1) \\implies 6$ cặp.\nXác suất $P = \\frac{6}{36} = \\frac{1}{6}$. Chọn A.',
    imagePrompt: 'Pair of red transparency playing dice showing numbers 3 and 4 adding to 7, dark wooden table background, macro photo style',
    tikzCode: `\\begin{tikzpicture}[scale=0.8]
  \\draw[fill=red!20, rounded corners=3pt] (0,0) rectangle (1.5,1.5);
  \\fill[red!80] (0.75,0.75) circle (0.15cm);
  \\fill[red!80] (0.3,0.3) circle (0.15cm);
  \\fill[red!80] (1.2,1.2) circle (0.15cm);
  \\draw[fill=blue!20, rounded corners=3pt] (2,0) rectangle (3.5,1.5);
  \\fill[blue!80] (2.4,0.4) circle (0.15cm);
  \\fill[blue!80] (3.1,1.1) circle (0.15cm);
  \\fill[blue!80] (2.4,1.1) circle (0.15cm);
  \\fill[blue!80] (3.1,0.4) circle (0.15cm);
  \\node[right] at (3.8,0.75) {$\\implies 3 + 4 = 7$};
\\end{tikzpicture}`
  }
];
