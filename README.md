# Retail Rocket Segmentator

Код позволяет случайно в равных пропорциях разделить пользователей на сайте на любое количество сегментов для проведения A/B/N тестирования.


## Пример использования:

	var numberOfSegments = 2;
	retailrocket.segmentator.getVisitorSegment(numberOfSegments);

Результатом работы кода будет номер сегмента (начиная с 0), в который попал пользователь. Принадлежность пользователя к сегменту сохраняется в cookie на 2 месяца при каждом срабатывании кода.


## Сценарий проведения A/B теста с помощью Retail Rocket Segmentator

1. Файл `retailrocket.segmentator.js` сохраняется в директорию сайта и подключается внутри <head>, например так: <script type="text/javascript" src="/path/to/retailrocket.segmentator.js"></script>

2. Сразу после подключения файла размещается код
	<script type="text/javascript">
		var numberOfSegments = 2;
		retailrocket.segmentator.getVisitorSegment(numberOfSegments);
	</script>

3. После того, как пользователь отнесен на сегмент, необходимо показать ему соответствующий вариант сайта/страницы.
Возможные варианты:
- Переадресация на URL альтернативный вариант страницы
	<script type="text/javascript">
		if(retailrocket.segmentator.getVisitorSegment(numberOfSegments)===1 && document.location.pathname==="path/to/pageBeingTested.html") {
			window.location = "http://yourwebsite.com/path/to/alternative.html";
		}
	</script>
- Отображение одного из вариантов кнопки (или любого другого элемента интерфейса). Для этого все вариации тестируемого элемента интерфейса выводятся на страницу со стилем `display:none`, а затем, в зависимости от того, в какой сегмент попал пользователь, один из скрытых элементов меняет стиль на `display:block`
	<script type="text/javascript">
		if(retailrocket.segmentator.getVisitorSegment(numberOfSegments)===0) {
			$(function(){
				$.("button_ver1").css('display','block');  // на сайте выше по коду должна быть подключена библиотека jQuery
			});
		} elseif (retailrocket.segmentator.getVisitorSegment(numberOfSegments)===1){
			$(function(){
				$.("button_ver2").css('display','block');  // на сайте выше по коду должна быть подключена библиотека jQuery
			});
		}
	</script>

4. Последним шагом является передача идентификатора сегмента в систему веб-аналитики для проведения пост-тест анализа. 

## Пример тестирования двух вариантов кнопки c отправкой идентификатора сегмента в Universal Analytics

	<script type="text/javascript" src="/path/to/retailrocket.segmentator.js"></script>
	<script type="text/javascript">
		var variation;

		$(function () {
		    var visitorSegment = retailrocket.segmentator.getVisitorSegment(numberOfSegments);
		    if (visitorSegment == 0) {
		        $.("button_ver1").css('display', 'block');
		        variation = 'Variation 1';
		    } else if (visitorSegment == 1) {
		        $.("button_ver2").css('display', 'block');
		        variation = 'Variation 2';
		    }
		});
	</script>

Затем в трекинг-коде Universal Analytics (который должен располагаться после приведенного выше кода), необходимо сделать вызов:

	ga('send', 'event', 'A/B Test', variation);

## Пример тестирования двух вариантов главной страницы с отправкой идентификатора сегмента в Яндекс.Метрика

	<script type="text/javascript" src="/path/to/retailrocket.segmentator.js"></script>
	<script type="text/javascript">
		var visitorSegment = retailrocket.segmentator.getVisitorSegment(numberOfSegments);
		if (visitorSegment === 1 && document.location.pathname === "path/to/oldVersion.html") {
	    		window.location = "http://yourwebsite.com/path/to/newVersion.html";
		} else if (visitorSegment === 0 && document.location.pathname === "path/to/oldVersion.html") {
	    	var yaParams = {
	        	ab_test: 'Старая версия'
	    	};
		}
		else if(visitorSegment === 1 && document.location.pathname === "/path/to/newVersion.html") {
	    		var yaParams = {
	        		ab_test: 'Новая версия'
	    		};
		}
		else if(visitorSegment === 0 && document.location.pathname === "/path/to/newVersion.html") {
	    		window.location = "http://yourwebsite.com/path/to/oldVersion.html";
		}	
	</script>

Затем в трекинг-коде Яндекс.Метрики (который должен располагаться после приведенного выше кода) создаем объект счетчика и указываем свойство params c нашими параметрами:
	
	new Ya.Metrika({id: XXXXXX, params: yaParams});
