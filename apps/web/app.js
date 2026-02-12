// Draw2Data - Stock Scenario Simulator
// Vanilla JS implementation with no external libraries

class Draw2Data {
    constructor() {
        this.canvas = document.getElementById('drawCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.strokes = []; // Array of strokes, each stroke is an array of {x, y} points
        this.currentStroke = null;
        this.isDrawing = false;
        this.generatedData = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.attachEventListeners();
        window.addEventListener('resize', () => this.setupCanvas());
    }

    setupCanvas() {
        const wrapper = this.canvas.parentElement;
        const rect = wrapper.getBoundingClientRect();
        
        // Set display size
        const displayWidth = Math.min(600, rect.width - 40);
        const displayHeight = 400;
        
        // Set actual size with device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = displayWidth * dpr;
        this.canvas.height = displayHeight * dpr;
        this.canvas.style.width = displayWidth + 'px';
        this.canvas.style.height = displayHeight + 'px';
        
        // Scale context to match DPR
        this.ctx.scale(dpr, dpr);
        
        // Store logical dimensions
        this.canvasWidth = displayWidth;
        this.canvasHeight = displayHeight;
        
        // Redraw existing strokes
        this.redrawCanvas();
    }

    attachEventListeners() {
        // Canvas drawing
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());

        // Touch support
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });

        // Buttons
        document.getElementById('generateBtn').addEventListener('click', () => this.generate());
        document.getElementById('clearBtn').addEventListener('click', () => this.clear());
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCSV());
    }

    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.currentStroke = [];
        const coords = this.getCanvasCoords(e);
        this.currentStroke.push(coords);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const coords = this.getCanvasCoords(e);
        this.currentStroke.push(coords);
        
        // Draw the line segment
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        const len = this.currentStroke.length;
        if (len >= 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentStroke[len - 2].x, this.currentStroke[len - 2].y);
            this.ctx.lineTo(coords.x, coords.y);
            this.ctx.stroke();
        }
    }

    stopDrawing() {
        if (this.isDrawing && this.currentStroke && this.currentStroke.length > 0) {
            this.strokes.push(this.currentStroke);
            this.currentStroke = null;
        }
        this.isDrawing = false;
    }

    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        for (const stroke of this.strokes) {
            if (stroke.length < 2) continue;
            
            this.ctx.beginPath();
            this.ctx.moveTo(stroke[0].x, stroke[0].y);
            for (let i = 1; i < stroke.length; i++) {
                this.ctx.lineTo(stroke[i].x, stroke[i].y);
            }
            this.ctx.stroke();
        }
    }

    clear() {
        this.strokes = [];
        this.currentStroke = null;
        this.generatedData = null;
        this.redrawCanvas();
        this.clearResults();
    }

    undo() {
        if (this.strokes.length > 0) {
            this.strokes.pop();
            this.redrawCanvas();
        }
    }

    clearResults() {
        document.getElementById('finalValue').textContent = '-';
        document.getElementById('cumReturn').textContent = '-';
        document.getElementById('cagr').textContent = '-';
        document.getElementById('mdd').textContent = '-';
        document.getElementById('dataTable').innerHTML = '<p class="no-data">데이터가 없습니다. 먼저 궤적을 그리고 \'생성\' 버튼을 눌러주세요.</p>';
    }

    generate() {
        if (this.strokes.length === 0) {
            alert('⚠️ 먼저 캔버스에 가격 궤적을 그려주세요.');
            return;
        }

        try {
            // Get settings
            const settings = this.getSettings();
            
            // Convert strokes to sorted coordinates
            const allPoints = this.strokes.flat();
            if (allPoints.length < 2) {
                alert('⚠️ 최소 2개의 포인트가 필요합니다.');
                return;
            }

            // Sort by x coordinate
            allPoints.sort((a, b) => a.x - b.x);

            // Convert canvas coordinates to price values
            const dailyCloses = this.generateDailyCloses(allPoints, settings);

            // Apply smoothing
            const smoothedCloses = this.applySmoothing(dailyCloses, settings.smoothWindow);

            // Generate weekly and monthly closes
            const weeklyCloses = this.resamplePeriodic(smoothedCloses, settings.weeklyPeriod);
            const monthlyCloses = this.resamplePeriodic(smoothedCloses, settings.monthlyPeriod);

            // Simulate Buy & Hold
            const simulation = this.simulateBuyAndHold(smoothedCloses, settings);

            // Store generated data
            this.generatedData = {
                dailyCloses: smoothedCloses,
                weeklyCloses: weeklyCloses,
                monthlyCloses: monthlyCloses,
                simulation: simulation,
                settings: settings
            };

            // Display results
            this.displayResults();

        } catch (error) {
            console.error('Generation error:', error);
            alert('⚠️ 데이터 생성 중 오류가 발생했습니다: ' + error.message);
        }
    }

    getSettings() {
        const numDays = parseInt(document.getElementById('numDays').value);
        const priceMin = parseFloat(document.getElementById('priceMin').value);
        const priceMax = parseFloat(document.getElementById('priceMax').value);
        const scaleType = document.getElementById('scaleType').value;
        const smoothWindow = parseInt(document.getElementById('smoothWindow').value);
        const weeklyPeriod = parseInt(document.getElementById('weeklyPeriod').value);
        const monthlyPeriod = parseInt(document.getElementById('monthlyPeriod').value);
        const initialCash = parseFloat(document.getElementById('initialCash').value);
        const tradingCost = parseFloat(document.getElementById('tradingCost').value) / 100;

        // Validation
        if (numDays < 10 || numDays > 1000) {
            throw new Error('일봉 수는 10~1000 사이여야 합니다.');
        }
        if (priceMin >= priceMax) {
            throw new Error('가격 최소값이 최대값보다 작아야 합니다.');
        }

        return {
            numDays,
            priceMin,
            priceMax,
            scaleType,
            smoothWindow,
            weeklyPeriod,
            monthlyPeriod,
            initialCash,
            tradingCost
        };
    }

    generateDailyCloses(points, settings) {
        const { numDays, priceMin, priceMax, scaleType } = settings;
        
        // Linear interpolation to generate N daily closes
        const result = [];
        const xMin = points[0].x;
        const xMax = points[points.length - 1].x;
        
        for (let day = 0; day < numDays; day++) {
            // Map day to canvas x coordinate
            const targetX = xMin + (xMax - xMin) * (day / (numDays - 1));
            
            // Find the two points that bracket targetX
            let i = 0;
            while (i < points.length - 1 && points[i + 1].x < targetX) {
                i++;
            }
            
            let canvasY;
            if (i >= points.length - 1) {
                canvasY = points[points.length - 1].y;
            } else {
                // Linear interpolation between points[i] and points[i+1]
                const x0 = points[i].x;
                const x1 = points[i + 1].x;
                const y0 = points[i].y;
                const y1 = points[i + 1].y;
                
                if (x1 - x0 === 0) {
                    canvasY = y0;
                } else {
                    const t = (targetX - x0) / (x1 - x0);
                    canvasY = y0 + t * (y1 - y0);
                }
            }
            
            // Convert canvas Y to price (invert because canvas Y grows downward)
            const normalizedY = 1 - (canvasY / this.canvasHeight);
            
            let price;
            if (scaleType === 'log' && priceMin > 0) {
                const logMin = Math.log(priceMin);
                const logMax = Math.log(priceMax);
                price = Math.exp(logMin + normalizedY * (logMax - logMin));
            } else {
                price = priceMin + normalizedY * (priceMax - priceMin);
            }
            
            // Clamp to min/max
            price = Math.max(priceMin, Math.min(priceMax, price));
            result.push(price);
        }
        
        return result;
    }

    applySmoothing(data, windowSize) {
        if (windowSize <= 1) return data;
        
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - Math.floor(windowSize / 2));
            const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
            
            let sum = 0;
            for (let j = start; j < end; j++) {
                sum += data[j];
            }
            result.push(sum / (end - start));
        }
        
        return result;
    }

    resamplePeriodic(dailyCloses, period) {
        const result = [];
        for (let i = period - 1; i < dailyCloses.length; i += period) {
            result.push(dailyCloses[i]);
        }
        return result;
    }

    simulateBuyAndHold(dailyCloses, settings) {
        const { initialCash, tradingCost } = settings;
        
        // Buy on day 0
        const firstPrice = dailyCloses[0];
        const sharesAfterCost = initialCash * (1 - tradingCost) / firstPrice;
        
        // Track portfolio value and cumulative return
        const portfolioValues = [];
        const cumReturns = [];
        
        for (let i = 0; i < dailyCloses.length; i++) {
            const portValue = sharesAfterCost * dailyCloses[i];
            portfolioValues.push(portValue);
            cumReturns.push((portValue - initialCash) / initialCash);
        }
        
        // Calculate KPIs
        const finalValue = portfolioValues[portfolioValues.length - 1];
        const cumReturn = cumReturns[cumReturns.length - 1];
        
        // CAGR: ((final/initial)^(1/years)) - 1
        // Assume 252 trading days per year
        const years = dailyCloses.length / 252;
        const cagr = Math.pow(finalValue / initialCash, 1 / years) - 1;
        
        // MDD: Maximum Drawdown
        let maxValue = portfolioValues[0];
        let maxDrawdown = 0;
        
        for (const value of portfolioValues) {
            if (value > maxValue) {
                maxValue = value;
            }
            const drawdown = (maxValue - value) / maxValue;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }
        
        return {
            portfolioValues,
            cumReturns,
            finalValue,
            cumReturn,
            cagr,
            mdd: maxDrawdown
        };
    }

    displayResults() {
        const { simulation, dailyCloses, weeklyCloses, monthlyCloses } = this.generatedData;
        
        // Display KPIs
        document.getElementById('finalValue').textContent = 
            simulation.finalValue.toFixed(2);
        document.getElementById('cumReturn').textContent = 
            (simulation.cumReturn * 100).toFixed(2) + '%';
        document.getElementById('cagr').textContent = 
            (simulation.cagr * 100).toFixed(2) + '%';
        document.getElementById('mdd').textContent = 
            (simulation.mdd * 100).toFixed(2) + '%';
        
        // Display data table (top 20 rows)
        this.displayDataTable();
    }

    displayDataTable() {
        const { dailyCloses, weeklyCloses, monthlyCloses, simulation } = this.generatedData;
        const numRows = Math.min(20, dailyCloses.length);
        
        let html = '<table><thead><tr>';
        html += '<th>Day</th><th>Close_D</th><th>Close_W</th><th>Close_M</th>';
        html += '<th>PortValue</th><th>CumRet</th>';
        html += '</tr></thead><tbody>';
        
        for (let i = 0; i < numRows; i++) {
            const weeklyIdx = Math.floor(i / this.generatedData.settings.weeklyPeriod);
            const monthlyIdx = Math.floor(i / this.generatedData.settings.monthlyPeriod);
            
            html += '<tr>';
            html += `<td>${i + 1}</td>`;
            html += `<td>${dailyCloses[i].toFixed(4)}</td>`;
            html += `<td>${weeklyIdx < weeklyCloses.length ? weeklyCloses[weeklyIdx].toFixed(4) : '-'}</td>`;
            html += `<td>${monthlyIdx < monthlyCloses.length ? monthlyCloses[monthlyIdx].toFixed(4) : '-'}</td>`;
            html += `<td>${simulation.portfolioValues[i].toFixed(2)}</td>`;
            html += `<td>${(simulation.cumReturns[i] * 100).toFixed(2)}%</td>`;
            html += '</tr>';
        }
        
        html += '</tbody></table>';
        document.getElementById('dataTable').innerHTML = html;
    }

    downloadCSV() {
        if (!this.generatedData) {
            alert('⚠️ 먼저 데이터를 생성해주세요.');
            return;
        }
        
        const { dailyCloses, weeklyCloses, monthlyCloses, simulation, settings } = this.generatedData;
        
        // Build CSV content
        let csv = 'Day,Close_D,Close_W,Close_M,PortValue,CumRet\n';
        
        for (let i = 0; i < dailyCloses.length; i++) {
            const weeklyIdx = Math.floor(i / settings.weeklyPeriod);
            const monthlyIdx = Math.floor(i / settings.monthlyPeriod);
            
            const row = [
                i + 1,
                dailyCloses[i].toFixed(6),
                weeklyIdx < weeklyCloses.length ? weeklyCloses[weeklyIdx].toFixed(6) : '',
                monthlyIdx < monthlyCloses.length ? monthlyCloses[monthlyIdx].toFixed(6) : '',
                simulation.portfolioValues[i].toFixed(2),
                (simulation.cumReturns[i] * 100).toFixed(4)
            ];
            csv += row.join(',') + '\n';
        }
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'draw2data_simulation.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new Draw2Data();
});
