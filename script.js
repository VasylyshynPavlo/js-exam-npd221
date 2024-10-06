$(document).ready(function () {
    // масив усіх зображень
    const allImages = ['arch.png', 'ubuntu.png', 'mint.png', 'fedora.png', 'red_star.png', 'debian.png', 'centos.png', 'elementary.png', 'linux.webp', 'manjaro.png', 'popos.png', 'endeavouros.png'];
    let cardImages = [];
    let attempts = 0;
    let mistakes = 0;
    let matchedPairs = 0;
    let totalPairs = 0;

    // ініціалізація гри
    function initGame() {
        attempts = 0;
        mistakes = 0;
        matchedPairs = 0;
        updateStats(); // оновлення статистики
        shuffleCards(); // перемішувння карт
        $('.game-board').empty(); // стирання дошки
        cardImages.forEach((image, index) => {
            const card = $(`
                <div class="card" data-image="${image}">
                    <img src="images/${image}" alt="${image}">
                </div>
            `); // темплейн для карт
            $('.game-board').append(card); // додавання до дошки
        });
        bindCardClick(); // прикриплюємо обробку натискання до всіх карт
    }

    // функція для перемішування карт
    function shuffleCards() {
        cardImages.sort(() => 0.5 - Math.random());
    }

    // логіка натискання на карту
    let flippedCards = [];
    let lockBoard = false;

    function bindCardClick() {
        $('.card').click(function () {
            if (lockBoard || $(this).hasClass('flipped')) return; // перевірка на перевнуту карту

            $(this).addClass('flipped'); // додавання класу перевернута для відображення зображенння
            flippedCards.push($(this));

            if (flippedCards.length === 2) { // якщо перевернутих карт 2, то збільшується кількість спроб
                attempts++;
                checkForMatch(); // перевірка на збіг
            }
        });
    }

    // перевірка на збіг
    function checkForMatch() {
        lockBoard = true; // блок дошки
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];

        if (card1.data('image') === card2.data('image')) {
            matchedPairs++; // збільшення відгаданих пар
            flippedCards = []; // очистка перевернутих карт
            lockBoard = false; // розблок дошки
            updateStats(); // оновлення статистики

            if (matchedPairs === totalPairs) { // перевірка на перемогу
                setTimeout(() => alert("Вітаю! Ви знайшли всі пари!"), 500);
            }
        } else {
            mistakes++; // збільшення кількісті помилок якщо не вірно
            setTimeout(() => {
                card1.removeClass('flipped'); // поверення в початковий стан
                card2.removeClass('flipped'); // те саме для 2-ї карти
                flippedCards = []; // очистка
                lockBoard = false; // розблок
                updateStats(); // оновлення статистики
            }, 1000);
        }
    }

    // функція для оновлення статистики
    function updateStats() {
        $('#attempts').text(`Кількість спроб: ${attempts}`);
        $('#mistakes').text(`Кількість помилок: ${mistakes}`);
        $('#pairs').text(`Знайдено пар: ${matchedPairs}/${totalPairs}`);
    }

    // вибір рівня складності
    $('#difficulty').change(function () {
        const difficulty = $(this).val();
        let columns, rows;

        switch (difficulty) {
            case 'easy': // 6 пар, 4х3 поле
                totalPairs = 6;
                columns = 3;
                rows = 4;
                break;
            case 'medium': // 8 пар, 4х4 поле
                totalPairs = 8;
                columns = 4;
                rows = 4;
                break;
            case 'hard': // 12 пар, 6х4 поле
                totalPairs = 12;
                columns = 6;
                rows = 4;
                break;
        }

        // створення пари карт
        cardImages = allImages.slice(0, totalPairs).concat(allImages.slice(0, totalPairs));

        // зміна поля на основі рівня складності
        $('.game-board').css({
            'grid-template-columns': `repeat(${columns}, 100px)`,
            'grid-template-rows': `repeat(${rows}, 100px)`
        });

        initGame(); // ініціалізація гри після вибору складності
    });

    // перезапуск гри
    $('#restart').click(function () {
        initGame();
    });

    // запуск гри з вибором рівня
    $('#difficulty').trigger('change');
});

