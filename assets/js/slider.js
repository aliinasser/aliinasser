document.querySelectorAll('.slider').forEach(slider => {
    const itemsContainer = slider.querySelector('.slider-items-container');
    const sliderControls = slider.querySelector('.slider-controls');

    let itemsCount = itemsContainer.childElementCount;
    let inViewCount = childrenInfo(itemsContainer).inView;
    let viewsCount = itemsCount / childrenInfo(itemsContainer).inView;
    let unCompletedItems = inViewCount - (itemsCount % inViewCount);

    // The default timeout for autoslide
    let timeout = 50000;
    // Storage autoslide attribute
    let autoslideAttr = slider.getAttribute('autoslide');
    // If autoslide attribute not empty override the timeout with the givin value
    if (autoslideAttr != "") timeout = autoslideAttr;
    // Check if the slider has autoslide attribute
    if (slider.hasAttribute('autoslide')) {
        // Interval to call next slide function that display the next view
        autoSlideInterval = setInterval(()=> {
            nextSlide(itemsContainer)
        }, timeout)
    }

    // If there more than 1 item per view
    if (inViewCount > 1) {
        // Add uncompleted items to dom
        const sliderItem = document.createElement('div');
        sliderItem.setAttribute('empty', '')
        sliderItem.classList.add('slider-item');

        // Check if any of slider item has title
        if (itemsContainer.querySelectorAll('.slider-item-title').length > 0) {
            // Create slider description element
            const description = document.createElement('span');
            description.className = 'slider-item-description';
            // Create slider title element
            const title = document.createElement('h4');
            title.className = 'slider-item-title';
            // Append elements
            sliderItem.appendChild(description);
            sliderItem.appendChild(title);
        }

        if (unCompletedItems < inViewCount) {
            for(i = 0; i < unCompletedItems; i++) {
                itemsContainer.appendChild(sliderItem.cloneNode(true));
            }
        }
    }

    // Add switch buttons to dom
    if (sliderControls != null && viewsCount > 1) {
        // Create button element and add "slider-button" class to it
        const button = document.createElement('button');
        button.classList.add('slider-button');

        // For items count / in view count append button
        for(i=0; i < viewsCount; i++) {
            sliderControls.appendChild(button.cloneNode(true));
        }

        // Add to the first button active class
        sliderControls.children[0].classList.add('active');

        // Slider button event
        document.querySelectorAll('.slider-button').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                // Storage button index
                let index = elementIndex(button);
                // Storage the container that at the same slider
                // Slide to the clicked button index
                slideToIndex(itemsContainer, index);
            })
        })
    }
})

// Get children in view count and gap in view
function childrenInfo(parent) {
    let inView = 0;
    let childrenCount = parent.children.length;
    let childWidth    = parent.querySelector('*').offsetWidth;
    let parentWidth   = parent.offsetWidth;
    // Calc children count and width
    for(let childrenWidth = 0; childrenWidth + childWidth <= parentWidth;) {
        inView++
        childrenWidth += childWidth;
    }
    // Storage the gap with simple math equation
    let gap = (parent.scrollWidth - (childWidth * childrenCount)) / (childrenCount - 1)
    // Storage the result at object
    var result = {
        inView: inView,
        gap:  gap
    };

    return result
}

// Found the index of the element that has active class
function elementIndex(element) {
    // Storage the parent element
    var parent = element.parentElement;
    // Get the index of the element between the siblings
    var index = Array.prototype.indexOf.call(parent.children, element);
    // Return the result
    return index;
}

// Add active class to the element that next to active element 
function addActiveToNext(element) {
    // Add active class to the element
    element.classList.remove('active');
    // Remove active class from other elements
    element.nextElementSibling.classList.add('active');
}

// Add active class to specific index of elements
function addActiveByIndex(element, index = 0) {
    // Get all element parent siblings
    var siblings = Array.from(element.parentNode.children);
    // Remove active class from all elements
    siblings.forEach(e => e.classList.remove('active'))
    // Add active class to the chosen element
    siblings[index].classList.add('active');
}

// Slide to specific index of elements
function slideToIndex(container, index) {
    // translateSize = ( container width + gap ) * index
    let translateSize = (container.offsetWidth + childrenInfo(container).gap) * index;
    // Move the slider by translateSize
    container.style.transform = `translateX(-${translateSize}px)`;
    // Storage switch button
    var button = container.closest('.slider').querySelector(`.slider-button:nth-of-type(${index + 1})`);
    // Add active class to current button index
    addActiveByIndex(button, index)
}

function nextSlide(container) {
    var slider = container.closest('.slider');
    if (slider.querySelectorAll(`.slider-button`).length == 0) return;
    // Set slider index to the current slider index + 1
    let sliderIndex = elementIndex(slider.querySelector(`.slider-button.active`)) + 1;
    // If current index equal the last view reset the slider index to 0
    if (sliderIndex == Math.ceil(container.childElementCount / childrenInfo(container).inView)) sliderIndex = 0;
    // translateSize = ( container width + gap ) * index
    let translateSize = (container.offsetWidth + childrenInfo(container).gap) * sliderIndex;
    // Move the slider by translateSize
    container.style.transform = `translateX(-${translateSize}px)`;
    // Add active class to the switch button with the slider index
    var sliderBtn = slider.querySelector(`.slider-button`);
    addActiveByIndex(sliderBtn, sliderIndex)
}

function previousSlide(container) {
    // In Progress
}