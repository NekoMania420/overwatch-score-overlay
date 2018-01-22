(() => {
  const changeEvent = new Event('change')
  const submitEvent = new Event('submit', {
    cancelable: true
  })
  const generateEvent = new Event('generate')

  // Control map
  const controlMapCheckbox = document.querySelector('#control')
  controlMapCheckbox.addEventListener('change', e => {
    if (e.target.checked) {
      document.querySelector('#leftTeamFaction').innerText = 'CTP'
      document.querySelector('#rightTeamFaction').innerText = 'CTP'
    } else {
      editForm.dispatchEvent(submitEvent)
    }

    document.querySelectorAll('[name="attack"]').forEach(attack => {
      attack.disabled = e.target.checked
    })

    document.dispatchEvent(generateEvent)
  }, false)

  // Hide group
  const hideGroupCheckbox = document.querySelector('#hideGroup')
  hideGroupCheckbox.addEventListener('change', e => {
    document.querySelector('#leftTeamGroup').classList.toggle('hide', e.target.checked)
    document.querySelector('#rightTeamGroup').classList.toggle('hide', e.target.checked)

    document.dispatchEvent(generateEvent)
  }, false)

  // Show center information
  const showInfoCheckbox = document.querySelector('#showInfo')
  showInfoCheckbox.addEventListener('change', e => {
    document.querySelector('#info').classList.toggle('show', e.target.checked)

    document.dispatchEvent(generateEvent)
  })

  // Update
  const editForm = document.querySelector('#edit')
  editForm.addEventListener('submit', e => {
    e.preventDefault()

    const inputs = document.querySelectorAll('[data-target]')
    inputs.forEach(input => {
      document.querySelector(input.dataset.target).innerText = input.value
    })

    const attack = document.querySelector('[name="attack"]:checked').value
    if (!controlMapCheckbox.checked) {
      if (attack === 'left') {
        document.querySelector('#leftTeamFaction').innerText = 'Attack'
        document.querySelector('#rightTeamFaction').innerText = 'Defend'
      } else {
        document.querySelector('#leftTeamFaction').innerText = 'Defend'
        document.querySelector('#rightTeamFaction').innerText = 'Attack'
      }
    }

    document.dispatchEvent(generateEvent)
  }, false)

  // Swap team
  const swapBtn = document.querySelector('#swapBtn')
  swapBtn.addEventListener('click', e => {
    let temp = document.querySelector('[name="leftTeamName"]').value
    document.querySelector('[name="leftTeamName"]').value = document.querySelector('[name="rightTeamName"]').value
    document.querySelector('[name="rightTeamName"]').value = temp

    temp = document.querySelector('[name="leftTeamGroup"]').value
    document.querySelector('[name="leftTeamGroup"]').value = document.querySelector('[name="rightTeamGroup"]').value
    document.querySelector('[name="rightTeamGroup"]').value = temp

    temp = document.querySelector('[name="leftTeamScore"]').value
    document.querySelector('[name="leftTeamScore"]').value = document.querySelector('[name="rightTeamScore"]').value
    document.querySelector('[name="rightTeamScore"]').value = temp

    const attackNotCheck = document.querySelector('[name="attack"]:not(:checked)')
    document.querySelector('[name="attack"]:checked').checked = false
    attackNotCheck.checked = true

    editForm.dispatchEvent(submitEvent)

    controlMapCheckbox.dispatchEvent(changeEvent)
  }, false)

  // Generate URL
  document.addEventListener('generate', e => {
    let params = new URLSearchParams(location.search)
    params.set('control', Number(document.querySelector('#control').checked))
    params.set('hideGroup', Number(document.querySelector('#hideGroup').checked))
    params.set('showInfo', Number(document.querySelector('#showInfo').checked))
    params.set('infoText', document.querySelector('[name="infoText"]').value)
    params.set('leftTeam', JSON.stringify({
      name: document.querySelector('[name="leftTeamName"]').value,
      group: document.querySelector('[name="leftTeamGroup"]').value,
      score: document.querySelector('[name="leftTeamScore"]').value
    }))
    params.set('rightTeam', JSON.stringify({
      name: document.querySelector('[name="rightTeamName"]').value,
      group: document.querySelector('[name="rightTeamGroup"]').value,
      score: document.querySelector('[name="rightTeamScore"]').value
    }))
    params.set('attack', document.querySelector('[name="attack"]:checked').value)

    window.history.replaceState(null, document.title, `${location.pathname}?${params.toString()}`)
    document.querySelector('#generatedUrl').value = `${location.origin}${location.pathname}?${params.toString()}`
  }, false)

  // Copy generated URL
  let copyAlert
  document.querySelector('#generatedUrl').addEventListener('click', e => {
    e.target.select()
    document.execCommand('copy')
    document.querySelector('.url > .alert').classList.add('show')
    if (copyAlert) {
      clearInterval(copyAlert)
    }
    copyAlert = setInterval(() => {
      document.querySelector('.url > .alert').classList.remove('show')
    }, 1000)
  }, false)

  // Reload button
  document.querySelector('#reloadBtn').addEventListener('click', e => {
    window.location.reload()
  }, false)

  function readData(params) {
    if (location.search) {
      let params = new URLSearchParams(location.search)

      if (parseInt(params.get('control'))) {
        document.querySelector('#control').click()
      }

      if (parseInt(params.get('hideGroup'))) {
        document.querySelector('#hideGroup').click()
      }

      if (parseInt(params.get('showInfo'))) {
        document.querySelector('#showInfo').click()
      }

      editForm.infoText.value = params.get('infoText')

      if (params.get('leftTeam')) {
        let data = JSON.parse(params.get('leftTeam'))
        editForm.leftTeamName.value = data.name
        editForm.leftTeamGroup.value = data.group
        editForm.leftTeamScore.value = data.score
      }

      if (params.get('rightTeam')) {
        let data = JSON.parse(params.get('rightTeam'))
        editForm.rightTeamName.value = data.name
        editForm.rightTeamGroup.value = data.group
        editForm.rightTeamScore.value = data.score
      }

      editForm.attack.value = params.get('attack')

      editForm.dispatchEvent(submitEvent)
    }
  }

  readData(new URLSearchParams(location.search))
})()