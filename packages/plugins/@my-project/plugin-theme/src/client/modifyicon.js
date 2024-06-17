/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

function addButtonWhenParentExists() {
  const intervalId = setInterval(() => {
    // Select the parent div with the specific class
    const parentDiv = document.querySelector('.css-14exgtg');

    // Check if the parent div exists
    if (parentDiv !== null) {
      // Create the button element
      const newButton = document.createElement('button');

      const partitionButton = document.createElement('button');

      const databaseButton = document.createElement('button');

      // Set attributes for the button
      newButton.setAttribute('data-testid', 'ai-explorer-button');
      newButton.setAttribute('title', 'AI Explore');
      newButton.setAttribute('type', 'button');
      newButton.setAttribute(
        'class',
        'ant-btn css-dev-only-do-not-override-10e56at ant-btn-default ant-btn-icon-only ant-tooltip-open',
      );

      // Set attributes for the button
      partitionButton.setAttribute('data-testid', 'partition-button');
      partitionButton.setAttribute('title', 'Partition');
      partitionButton.setAttribute('type', 'button');
      partitionButton.setAttribute(
        'class',
        'ant-btn css-dev-only-do-not-override-10e56at ant-btn-default ant-btn-icon-only ant-tooltip-open',
      );

      // Set attributes for the button
      databaseButton.setAttribute('data-testid', 'database-button');
      databaseButton.setAttribute('title', 'Database');
      databaseButton.setAttribute('type', 'button');
      databaseButton.setAttribute(
        'class',
        'ant-btn css-dev-only-do-not-override-10e56at ant-btn-default ant-btn-icon-only ant-tooltip-open',
      );

      // Set inner HTML for the button
      newButton.innerHTML = `
          <span class="ant-btn-icon">
            <span role="img" aria-label="api" class="anticon anticon-api" style="color: rgba(255, 255, 255, 0.65);">
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4247 4.66199C10.4279 4.65334 10.4306 4.64989 10.4311 4.64927C10.4317 4.64853 10.432 4.64825 10.4325 4.64792C10.4341 4.64689 10.4403 4.64379 10.4508 4.64379C10.4613 4.64379 10.4675 4.64689 10.4691 4.64792C10.4696 4.64825 10.4699 4.64853 10.4705 4.64927C10.471 4.64989 10.4737 4.65334 10.4769 4.66199L11.747 8.09438C11.8571 8.39188 12.0917 8.62644 12.3892 8.73653L15.8216 10.0066C15.8302 10.0098 15.8337 10.0125 15.8343 10.013C15.835 10.0136 15.8353 10.014 15.8356 10.0145C15.8367 10.016 15.8398 10.0223 15.8398 10.0328C15.8398 10.0433 15.8367 10.0495 15.8356 10.0511C15.8355 10.0514 15.8353 10.0516 15.835 10.0518C15.8348 10.052 15.8346 10.0523 15.8343 10.0525C15.8337 10.053 15.8302 10.0557 15.8216 10.0589L12.3892 11.329C12.0917 11.4391 11.8571 11.6736 11.747 11.9712L10.4769 15.4035C10.4737 15.4122 10.471 15.4156 10.4705 15.4163C10.4699 15.417 10.4696 15.4173 10.4691 15.4176C10.4675 15.4186 10.4613 15.4217 10.4508 15.4217C10.4403 15.4217 10.4341 15.4186 10.4325 15.4176C10.432 15.4173 10.4317 15.417 10.4311 15.4163C10.4306 15.4156 10.4279 15.4122 10.4247 15.4035L9.15456 11.9712C9.04447 11.6737 8.80991 11.4391 8.51241 11.329L5.08002 10.0589C5.07137 10.0557 5.06792 10.053 5.0673 10.0525C5.06695 10.0522 5.06671 10.052 5.06651 10.0518C5.06629 10.0516 5.06613 10.0513 5.06595 10.0511C5.06492 10.0495 5.06182 10.0433 5.06182 10.0328C5.06182 10.0223 5.06492 10.016 5.06595 10.0145C5.06628 10.014 5.06655 10.0136 5.0673 10.013C5.06792 10.0125 5.07137 10.0098 5.08002 10.0066L8.51241 8.73653C8.80991 8.62644 9.04447 8.39188 9.15456 8.09438L10.4247 4.66199Z" stroke="white" stroke-opacity="0.85" stroke-width="1.05902"/>
                <path d="M4.43288 1.59644C4.43608 1.58779 4.43879 1.58434 4.43928 1.58372C4.43987 1.58297 4.44021 1.5827 4.44072 1.58237C4.44229 1.58134 4.4485 1.57824 4.45902 1.57824C4.46953 1.57824 4.47574 1.58134 4.47731 1.58237C4.47782 1.5827 4.47816 1.58297 4.47876 1.58372C4.47925 1.58433 4.48195 1.58779 4.48515 1.59643L5.07781 3.19807C5.1879 3.49557 5.42246 3.73013 5.71996 3.84022L7.3216 4.43288C7.33024 4.43608 7.3337 4.43879 7.33431 4.43928C7.33506 4.43987 7.33533 4.44021 7.33567 4.44072C7.3367 4.44229 7.3398 4.4485 7.3398 4.45902C7.3398 4.46953 7.3367 4.47574 7.33567 4.47731C7.33533 4.47782 7.33506 4.47816 7.33431 4.47876C7.3337 4.47925 7.33025 4.48195 7.3216 4.48515L5.71996 5.07781C5.42246 5.1879 5.1879 5.42246 5.07781 5.71996L4.48515 7.3216C4.48196 7.33024 4.47925 7.3337 4.47876 7.33431C4.47846 7.33469 4.47822 7.33495 4.47799 7.33515C4.47777 7.33535 4.47756 7.3355 4.47731 7.33567C4.47574 7.3367 4.46953 7.3398 4.45902 7.3398C4.4485 7.3398 4.44229 7.3367 4.44072 7.33567C4.44021 7.33533 4.43987 7.33506 4.43928 7.33431C4.43879 7.3337 4.43608 7.33025 4.43288 7.3216L3.84022 5.71996C3.73014 5.42246 3.49557 5.1879 3.19807 5.07781L1.59643 4.48515C1.58779 4.48196 1.58434 4.47925 1.58372 4.47876C1.58297 4.47816 1.5827 4.47782 1.58237 4.47731C1.58134 4.47574 1.57824 4.46953 1.57824 4.45902C1.57824 4.4485 1.58134 4.44229 1.58237 4.44072C1.5827 4.44021 1.58297 4.43987 1.58372 4.43928C1.58433 4.43879 1.58779 4.43608 1.59643 4.43288L3.19807 3.84022C3.49557 3.73014 3.73013 3.49557 3.84022 3.19807L4.43288 1.59644Z" stroke="white" stroke-opacity="0.85" stroke-width="1.05902"/>
            </svg>            
            </span>
          </span>
        `;

      // Set inner HTML for the button
      partitionButton.innerHTML = `
          <span class="ant-btn-icon">
            <span role="img" aria-label="api" class="anticon anticon-api" style="color: rgba(255, 255, 255, 0.65);">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.1147 6.41763H14.6246C14.7632 6.41763 14.8754 6.30537 14.8754 6.16679V1.65514C14.8754 1.51656 14.7632 1.4043 14.6246 1.4043H10.1147C9.9761 1.4043 9.86384 1.51656 9.86384 1.65514V3.28474H7.48347C7.41506 3.28474 7.35892 3.34087 7.35892 3.40928V7.29471H5.85562V5.60196C5.85562 5.46338 5.74336 5.35112 5.60478 5.35112H1.09313C0.95455 5.35112 0.842285 5.46338 0.842285 5.60196V10.1136C0.842285 10.2522 0.95455 10.3645 1.09313 10.3645H5.60303C5.7416 10.3645 5.85387 10.2522 5.85387 10.1136V8.42086H7.35717V12.3063C7.35717 12.3747 7.4133 12.4308 7.48171 12.4308H9.86208V14.0604C9.86208 14.199 9.97435 14.3113 10.1129 14.3113H14.6228C14.7614 14.3113 14.8737 14.199 14.8737 14.0604V9.55229C14.8737 9.41371 14.7614 9.30144 14.6228 9.30144H10.1147C9.9761 9.30144 9.86384 9.41371 9.86384 9.55229V11.3064H8.48508V4.41265H9.86384V6.16679C9.86384 6.30537 9.9761 6.41763 10.1147 6.41763ZM11.0531 2.59536H13.6844V5.22833H11.0531V2.59536ZM4.66456 9.17515H2.03335V6.54393H4.66456V9.17515ZM11.0531 10.4925H13.6844V13.1255H11.0531V10.4925Z" fill="white" fill-opacity="0.85"/>
              </svg>                     
            </span>
          </span>
        `;

      // Set inner HTML for the button
      databaseButton.innerHTML = `
          <span class="ant-btn-icon">
            <span role="img" aria-label="api" class="anticon anticon-api" style="color: rgba(255, 255, 255, 0.65);">
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_651_8471)">
              <path d="M13.4714 0.352295H2.24492C1.93444 0.352295 1.68359 0.603137 1.68359 0.91362V15.5081C1.68359 15.8186 1.93444 16.0694 2.24492 16.0694H13.4714C13.7819 16.0694 14.0328 15.8186 14.0328 15.5081V0.91362C14.0328 0.603137 13.7819 0.352295 13.4714 0.352295ZM2.94658 1.61528H12.7698V5.26389H2.94658V1.61528ZM12.7698 10.0352H2.94658V6.38654H12.7698V10.0352ZM12.7698 14.8064H2.94658V11.1578H12.7698V14.8064ZM4.20956 3.43958C4.20956 3.62568 4.28348 3.80414 4.41507 3.93573C4.54666 4.06732 4.72512 4.14124 4.91122 4.14124C5.09731 4.14124 5.27578 4.06732 5.40736 3.93573C5.53895 3.80414 5.61287 3.62568 5.61287 3.43958C5.61287 3.25349 5.53895 3.07502 5.40736 2.94344C5.27578 2.81185 5.09731 2.73793 4.91122 2.73793C4.72512 2.73793 4.54666 2.81185 4.41507 2.94344C4.28348 3.07502 4.20956 3.25349 4.20956 3.43958ZM4.20956 8.21085C4.20956 8.39694 4.28348 8.57541 4.41507 8.707C4.54666 8.83858 4.72512 8.91251 4.91122 8.91251C5.09731 8.91251 5.27578 8.83858 5.40736 8.707C5.53895 8.57541 5.61287 8.39694 5.61287 8.21085C5.61287 8.02476 5.53895 7.84629 5.40736 7.7147C5.27578 7.58312 5.09731 7.50919 4.91122 7.50919C4.72512 7.50919 4.54666 7.58312 4.41507 7.7147C4.28348 7.84629 4.20956 8.02476 4.20956 8.21085ZM4.20956 12.9821C4.20956 13.1682 4.28348 13.3467 4.41507 13.4783C4.54666 13.6098 4.72512 13.6838 4.91122 13.6838C5.09731 13.6838 5.27578 13.6098 5.40736 13.4783C5.53895 13.3467 5.61287 13.1682 5.61287 12.9821C5.61287 12.796 5.53895 12.6176 5.40736 12.486C5.27578 12.3544 5.09731 12.2805 4.91122 12.2805C4.72512 12.2805 4.54666 12.3544 4.41507 12.486C4.28348 12.6176 4.20956 12.796 4.20956 12.9821Z" fill="white" fill-opacity="0.85"/>
              </g>
              <defs>
              <clipPath id="clip0_651_8471">
              <rect width="15.7171" height="15.7171" fill="white" transform="translate(0 0.352295)"/>
              </clipPath>
              </defs>
              </svg>                                       
            </span>
          </span>
        `;

      // Append the button to the parent div
      parentDiv.appendChild(partitionButton);
      parentDiv.appendChild(databaseButton);
      parentDiv.appendChild(newButton);

      // Add click event listener to the button
      newButton.addEventListener('click', () => {
        window.location.href = 'http://localhost:13000/explore';
      });

      // Clear the interval to stop checking
      clearInterval(intervalId);
    }
  }, 100); // Check every 100 milliseconds
}

// Call the function to start checking
addButtonWhenParentExists();

function insertRememberMeForgotDiv() {
  const intervalId = setInterval(() => {
    // Select the parent div with the specific class
    const parentDiv = document.querySelector('.ant-formily-layout.ant-form-vertical');

    // Check if the parent div exists
    if (parentDiv !== null && parentDiv.children.length > 1) {
      // Create the new element
      const rememberMeForgotDiv = document.createElement('div');
      rememberMeForgotDiv.className = 'font-family-golos remember-me-forgot';
      rememberMeForgotDiv.style.display = 'flex';
      rememberMeForgotDiv.style.justifyContent = 'space-between';
      rememberMeForgotDiv.style.marginTop = '1em';
      rememberMeForgotDiv.style.marginBottom = '1em';

      // Create the inner content
      const rememberMeDiv = document.createElement('div');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      rememberMeDiv.appendChild(checkbox);
      rememberMeDiv.appendChild(document.createTextNode(' Remember Me'));

      const forgotPasswordDiv = document.createElement('div');
      forgotPasswordDiv.textContent = 'Forgot your password?';

      // Append the inner content to the main div
      rememberMeForgotDiv.appendChild(rememberMeDiv);
      rememberMeForgotDiv.appendChild(forgotPasswordDiv);

      // Insert the new element as the second child
      parentDiv.insertBefore(rememberMeForgotDiv, parentDiv.children[2]);

      // Clear the interval to stop checking
      clearInterval(intervalId);
    }
  }, 100); // Check every 100 milliseconds
}

// Call the function to start checking
insertRememberMeForgotDiv();

function addClassByAriaLabel(ariaLabel, className) {
  const intervalId = setInterval(() => {
    // Select the element with the specified aria-label
    var element = document.querySelector('[aria-label="' + ariaLabel + '"]');

    // Check if the element exists
    if (element) {
      // Add the specified class name to the element
      element.classList.add(className);

      // Clear the interval to stop checking
      clearInterval(intervalId);
    }
  }, 100); // Check every 100 milliseconds
}

// Usage example
addClassByAriaLabel('action-Action-Sign in', 'font-family-golos');
