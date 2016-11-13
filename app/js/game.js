    var width = window.innerWidth;
    var height = window.innerHeight;
    var count_line; // длинна одного ребра в матрице
    var stage; // определение объекта canvas     
    // функция изменения цвета и атрибута active(true - живая точка, false - мертвая);
    function change_point() {
        //определяем какой будет цвет
        var fill = this.fill() == 'grey' ? 'black' : 'grey';
        //меняем цвет
        this.fill(fill);
        //в зависимости от цвета меняет атрибут active
        if (fill == 'black') {
            this.active = true;
        }
        else {
            this.active = false;
        }
        //обновляем точку на слое
        layer.batchDraw();
    }
    var requestId;
    //слой на которой все отрисовывается
    var layer;
    // массив всех объектов на поле
    var mass_all;
    //функция отрисовки всех точек на поле
    function Begin() {
        // если был то отчистить
        if (stage) {
            stage.destroy();
        }
        // определение объекта canvas 
        stage = new Konva.Stage({
            container: 'container'
            , width: width
            , height: height
            , draggable: true
        });
        // получает длинну ребра
        count_line = parseInt(document.getElementById('count_line').value);
        // отределяет слой
        layer = new Konva.Layer();
        // объявляем пустой массив куда будем ложить все точки( объекты )
        mass_all = [];
        for (var i = 0; i < count_line; i++) {
            //ложим в первый элемент массива массив - делаем его двумерным
            mass_all[i] = [];
            for (var j = 0; j < count_line; j++) {
                //создаем точку
                var rect = new Konva.Rect({
                    x: 10 * j + 50
                    , y: 10 * i + 50
                    , width: 10
                    , height: 10
                    , fill: 'grey'
                    , stroke: 'black'
                    , strokeWidth: 1
                });
                //ложим её в массив
                mass_all[i].push(rect);
                //добавляем точку на слой
                layer.add(rect);
            }
        }
        //вераем событие на весь объект
        stage.on('click', function (e) {
            //определяем на какой кубик было нажатие
            var el = e.target
                //меняем его
            change_point.apply(el);
            //e.preventDefault();
        });
        //добавляем слой в сцены
        stage.add(layer);
        //проганяемся по всем точкам и устанавливаем им атрибут active = false (мертвая)
        for (var i = 0; i < count_line; i++) {
            for (var j = 0; j < count_line; j++) {
                var el = mass_all[i][j];
                el.active = false;
            }
        }
    }
    var check_mass = []; //выделяем пустой массив для хранения состояние в одной итерации
    var check_mass_last = []; // ещё массив для храниния предыдущего состояния точек и сравнения с новым, для отределения не подошла ли игра к концу
    //объетк с методами для точек
    var Check_point = {
            //проверка для живой точки нужно ли ей умирать или нет
            check_active: function (get_i, get_j) {
                    //получем в аргументы изначальную позицию точки и сдвигаем её на одну позицию вверх и влево
                    var start_i = get_i - 1;
                    var start_j = get_j - 1;
                    //переменная для проверки колличества живых точек рядом
                    var count_for_rezult = 0;
                    //прогоняемся по всем рядом стоящим точкам
                    for (var i = 0; i < 3; i++) {
                        for (var j = 0; j < 3; j++) {
                            var point_i = start_i + i;
                            var point_j = start_j + j
                                //условие для того чтобы не брать в результат проверяющую точку в данный мемент - пропустить её и если вылезли за край тоже пропускаем итерацию
                            if (point_i < 0 || point_i > count_line - 1 || point_j < 0 || point_j > count_line - 1 || point_i == get_i && point_j == get_j) {
                                continue;
                            }
                            var el = mass_all[point_i][point_j];
                            if (el.active) {
                                //если рядом живая точка увеличиваем на оди колличество живых родственников
                                count_for_rezult++;
                            }
                        }
                    }
                    //если все впорядке и живая точка продолжает жить возвращаем false
                    if (count_for_rezult <= 3 && count_for_rezult >= 2) {
                        return false;
                    }
                    //если живая точка должна умереть возвращаем true - значит нужно изменить её значение
                    else {
                        return true;
                    }
                }
                //проверка для мертвой точки нужно ли ей рождаться или нет            
                
            , check_inactive: function (get_i, get_j) {
                    //получем в аргументы изначальную позицию точки и сдвигаем её на одну позицию вверх и влево
                    var start_i = get_i - 1;
                    var start_j = get_j - 1;
                    //переменная для проверки колличества живых точек рядом
                    var count_for_rezult = 0;
                    //прогоняемся по всем рядом стоящим точкам
                    for (var i = 0; i < 3; i++) {
                        for (var j = 0; j < 3; j++) {
                            var point_i = start_i + i;
                            var point_j = start_j + j;
                            //условие для того чтобы не брать в результат проверяющую точку в данный мемент - пропустить её и если вылезли за край тоже пропускаем итерацию
                            if (point_i < 0 || point_i > count_line - 1 || point_j < 0 || point_j > count_line - 1 || point_i == get_i && point_j == get_j) {
                                continue;
                            }
                            var el = mass_all[point_i][point_j];
                            if (el.active) {
                                //если рядом живая точка увеличиваем на оди колличество живых родственников
                                count_for_rezult++;
                            }
                        }
                    }
                    //если рядом с мертвой точкой есть ровно 3 живые то возвращаем true - зародить в ней жизнь
                    if (count_for_rezult == 3) {
                        return true;
                    }
                    //иначе ничего не делать            
                    else {
                        return false;
                    }
                }
                //прогонка по всем точкам и проверка их
                
            , check: function () {
                    var the_same = 0; //колличество совпадений с предыдущёй итерацией
                    var el; //точка на данной итерации
                    var life_this; //состояние данной точки
                    //прогон по всем точкам
                    for (var i = 0; i < count_line; i++) {
                        check_mass[i] = []; //делаем массив с состоянием точек двумерным                
                        var that_do; //переменная котороя отределяет дальнейшую судьбу точки ( жить , умереть )
                        for (var j = 0; j < count_line; j++) {
                            el = mass_all[i][j]; //отределяем точку
                            life_this = el.active; // определяем её состояние ( мертвая / живая )
                            if (life_this) {
                                //если живая то в переменную that_do попадёт результат проверки функцией для живых check_active
                                that_do = Check_point.check_active(i, j);
                            }
                            else {
                                //если мертвая то в переменную that_do попадёт результат проверки функцией для мертвых check_inactive
                                that_do = Check_point.check_inactive(i, j)
                            }
                            //кладём в массив состояния true/false (изменить / нет)
                            check_mass[i].push(that_do);
                        }
                    }
                    //если массив предыдущих состояний пустой то заполним его 
                    if (check_mass_last == '') {
                        for (var i = 0; i < count_line; i++) {
                            check_mass_last[i] = []
                            for (var j = 0; j < count_line; j++) {
                                check_mass_last[i][j] = null;
                            }
                        }
                    }
                    //проходим по массиву состояний
                    for (var i = 0; i < count_line; i++) {
                        for (var j = 0; j < count_line; j++) {
                            //если нужно поменять меняем состояние точки
                            if (check_mass[i][j]) {
                                var el_change = mass_all[i][j];
                                change_point.call(el_change);
                            }
                            //сравниваем с предыдущим состоянием и считаем колличество совпадений
                            if (check_mass[i][j] == check_mass_last[i][j]) {
                                the_same++
                            }
                        }
                    }
                    //делаем из нынешнего массива прошлый та как он уже отработал
                    check_mass_last = check_mass.slice();
                    //если все точки совпали то останавливаем изменения
                    if (the_same == (count_line * count_line)) {
                        clearInterval(anim);
                        alert('END!');
                        //return false;
                    }
                }
                //метод запуска
                
            , play: function () {
                /*requestAnimationFrame(function measure(time) {                
                    var that_next = Check_point.check();
                    if (that_next) {
                        requestAnimationFrame(measure);
                    }                
                });*/
                //переодическая проверка точек каждые 20мс
                anim = setInterval(Check_point.check, 20);
            }
            , stop: function () {
                //остановка
                clearInterval(anim);
            }
        }
    //вешаем события на кнопки
    var button_go = document.getElementById('go');
    var button_clear = document.getElementById('clear');
    var create = document.getElementById('create');
    var one_step = document.getElementById('one_step');
    var stop = document.getElementById('stop');
    one_step.onclick = function () {
        Check_point.check();
    }
    button_go.onclick = function () {
        Check_point.play(true);
    }
    create.onclick = function () {
        Begin();
    }
    button_clear.onclick = function () {
        Begin();
    }
    stop.onclick = function () {
        Check_point.stop();
    }