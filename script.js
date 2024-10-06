$(document).ready(function () {
    // масив зображень
    const images = ['arch.png', 'ubuntu.png', 'mint.png', 'fedora.png', 'red_star.png', 'debian.png', 'centos.png', 'elementary.png', 'linux.webp', 'manjaro.png', 'popos.png', 'endeavouros.png'];
    let cardImages = images.concat(images); // створюємо пари
    let attempts = 0;
    let mistakes = 0;
    let matchedPairs = 0;
    const totalPairs = images.length; // 12 пар

    // ініціалізація гри
    function initGame() {
        attempts = 0;
        mistakes = 0;
        matchedPairs = 0;
        updateStats();
        shuffleCards(); // перемішуємо карти
        $('.game-board').empty(); // очищаємо дошку
        cardImages.forEach((image, index) => {
            const card = $(`
                <div class="card" data-image="${image}">
                    <img src="images/${image}" alt="${image}">
                </div>
            `);
            $('.game-board').append(card);
        });
        bindCardClick();
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
            if (lockBoard || $(this).hasClass('flipped')) return;

            $(this).addClass('flipped');
            flippedCards.push($(this));

            if (flippedCards.length === 2) {
                attempts++; // збільшуємо кількість спроб
                checkForMatch();
            }
        });
    }

    // перевірка на збіг
    function checkForMatch() {
        lockBoard = true;
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];

        if (card1.data('image') === card2.data('image')) {
            matchedPairs++; // збільшити кількість збігів
            flippedCards = [];
            lockBoard = false;
            updateStats(); // оновлення статистики

            if (matchedPairs === totalPairs) {
                setTimeout(() => alert("Вітаю! Ви знайшли всі пари!"), 500);
            }
        } else {
            mistakes++; // збільшуємо кількість помилок
            setTimeout(() => {
                card1.removeClass('flipped');
                card2.removeClass('flipped');
                flippedCards = [];
                lockBoard = false;
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

    // перезапуск гри
    $('#restart').click(function () {
        initGame();
    });

    // запуск гри при завантаженні сторінки
    initGame();
});

