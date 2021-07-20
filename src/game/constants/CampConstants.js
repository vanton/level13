define(['ash', 'game/vos/ResourcesVO'], function (Ash, ResourcesVO) {
	
	var CampConstants = {
	
		// population
		POPULATION_PER_HOUSE: 4,
		POPULATION_PER_HOUSE2: 6,
		POOL_RUMOURS_PER_POPULATION: 3,
		
		// Storage
		BASE_STORAGE: 50,
		STORAGE_PER_IMPROVEMENT: 50,
		STORAGE_PER_IMPROVEMENT_LEVEL_2: 80,
		STORAGE_PER_IMPROVEMENT_LEVEL_3: 150,
		
		// Rumours
		RUMOURS_PER_POP_PER_SEC_BASE: 0.0003,
		RUMOUR_BONUS_PER_CAMPFIRE_BASE: 1.2,
		RUMOURS_BONUS_PER_CAMPFIRE_PER_LEVEL: 0.1,
		RUMOUR_BONUS_PER_MARKET_BASE: 1.1,
		RUMOURS_BONUS_PER_MARKET_PER_UPGRADE: 0.01,
		RUMOUR_BONUS_PER_INN_BASE: 1.1,
		RUMOURS_BONUS_PER_INN_PER_UPGRADE: 0.01,
		RUMOURS_PER_VISIT_MARKET_BASE: 0,
		
		// Evidence
		EVIDENCE_BONUS_PER_LIBRARY_LEVEL: 0.15,
		EVIDENCE_BONUS_PER_RESEARCH_CENTER_LEVEL: 0.25,
		
		// Favour
		FAVOUR_BONUS_PER_TEMPLE_LEVEL: 0.1,
		FAVOUR_PER_DONATION: 5,
		
		// Cost of workers
		CONSUMPTION_WATER_PER_WORKER_PER_S: 0.02,
		CONSUMPTION_FOOD_PER_WORKER_PER_S: 0.01,
		CONSUMPTION_HERBS_PER_WORKER_PER_S: 0.05,
		CONSUMPTION_METAL_PER_TOOLSMITH_PER_S: 0.03,
		CONSUMPTION_METAL_PER_CONCRETE_PER_S: 0.02,
		
		// Production
		PRODUCTION_METAL_PER_WORKER_PER_S: 0.02,
		PRODUCTION_FOOD_PER_WORKER_PER_S: 0.05,
		PRODUCTION_WATER_PER_WORKER_PER_S: 0.05,
		PRODUCTION_ROPE_PER_WORKER_PER_S: 0.03,
		PRODUCTION_FUEL_PER_WORKER_PER_S: 0.02,
		PRODUCTION_RUBBER_PER_WORKER_PER_S: 0.02,
		PRODUCTION_HERBS_PER_WORKER_PER_S: 0.02,
		PRODUCTION_MEDICINE_PER_WORKER_PER_S: 0.01,
		PRODUCTION_TOOLS_PER_WORKER_PER_S: 0.02,
		PRODUCTION_CONCRETE_PER_WORKER_PER_S: 0.02,
		PRODUCTION_EVIDENCE_PER_WORKER_PER_S: 0.00075,
		PRODUCTION_FAVOUR_PER_WORKER_PER_S: 0.00075,
		
		// reputation
		REPUTATION_TO_POPULATION_FACTOR: 0.83,
		REPUTATION_TO_POPULATION_OFFSET: -0.25,
		REPUTATION_PER_RADIO_PER_SEC: 0.1,
		REPUTATION_PER_HOUSE_FROM_GENERATOR: 0.3,
		REPUTATION_PENALTY_DEFENCES_THRESHOLD: 0.25,
		REPUTATION_PENALTY_TYPE_FOOD: "FOOD",
		REPUTATION_PENALTY_TYPE_WATER: "WATER",
		REPUTATION_PENALTY_TYPE_DEFENCES: "DEFENCES",
		REPUTATION_PENALTY_TYPE_HOUSING: "HOUSING",
		REPUTATION_PENALTY_TYPE_LEVEL_POP: "LEVEL_POPULATION",
		
		// raids
		CAMP_BASE_DEFENCE: 7,
		FORTIFICATION_1_DEFENCE: 6,
		FORTIFICATION_2_DEFENCE: 10,
		
		// Workers per building
		CHEMISTS_PER_WORKSHOP: 5,
		RUBBER_WORKER_PER_WORKSHOP: 5,
		GARDENER_PER_GREENHOUSE: 5,
	
		workerTypes: {
			scavenger: {
				id: "scavenger",
				resourceProduced: resourceNames.metal,
			},
			trapper: {
				id: "trapper",
				resourceProduced: resourceNames.food,
			},
			water: {
				id: "water",
				resourceProduced: resourceNames.water,
			},
			ropemaker: {
				id: "ropemaker",
				resourceProduced: resourceNames.rope,
			},
			chemist: {
				id: "chemist",
				resourceProduced: resourceNames.fuel,
				getLimitNum: function (improvements, workshops) { return workshops.fuel || 0; },
				getLimitText: function (num) { return num + " refineries cleared"; },
			},
			rubbermaker: {
				id: "rubbermaker",
				resourceProduced: resourceNames.rubber,
				getLimitNum: function (improvements, workshops) { return workshops.rubber || 0; },
				getLimitText: function (num) { return num + " plantations found"; },
			},
			gardener: {
				id: "gardener",
				resourceProduced: resourceNames.herbs,
				getLimitNum: function (improvements, workshops) { return workshops.herbs || 0; },
				getLimitText: function (num) { return num + " greenhouses"; },
			},
			apothecary: {
				id: "apothecary",
				resourceProduced: resourceNames.medicine,
				getLimitNum: function (improvements, workshops) { return improvements.getCount(improvementNames.apothecary); },
				getLimitText: function (num) { return num + " apothecaries built"; },
			},
			toolsmith: {
				id: "toolsmith",
				resourceProduced: resourceNames.tools,
				getLimitNum: function (improvements, workshops) { return improvements.getCount(improvementNames.smithy); },
				getLimitText: function (num) { return num + " smithies built"; },
			},
			concrete: {
				id: "concrete",
				resourceProduced: resourceNames.concrete,
				getLimitNum: function (improvements, workshops) { return improvements.getCount(improvementNames.cementmill); },
				getLimitText: function (num) { return num + " cement mills built"; },
			},
			scientist: {
				id: "scientist",
				getLimitNum: function (improvements, workshops) { return improvements.getCount(improvementNames.library); },
				getLimitText: function (num) { return num + " libraries built"; },
			},
			soldier: {
				id: "soldier",
				getLimitNum: function (improvements, workshops) { return improvements.getCount(improvementNames.barracks); },
				getLimitText: function (num) { return num + " barracks built"; },
			},
			cleric: {
				id: "cleric",
				getLimitNum: function (improvements, workshops) { return improvements.getCount(improvementNames.temple); },
				getLimitText: function (num) { return num + " temples built"; },
			},
		},
		
		getWorkerIDByProducedResource: function (resourceName) {
			for (var key in CampConstants.workerTypes) {
				var def = CampConstants.workerTypes[key];
				if (def.resourceProduced && def.resourceProduced == resourceName) return def.id;
			}
			return null;
		},
		
		// storage capacity of one camp
		getStorageCapacity: function (storageCount, storageLevel) {
			var storagePerImprovement = CampConstants.STORAGE_PER_IMPROVEMENT;
			if (storageLevel > 1) storagePerImprovement = CampConstants.STORAGE_PER_IMPROVEMENT_LEVEL_2;
			if (storageLevel > 2) storagePerImprovement = CampConstants.STORAGE_PER_IMPROVEMENT_LEVEL_3;
			return CampConstants.BASE_STORAGE + storageCount * storagePerImprovement;
		},
		
		// population cap of one camp
		getHousingCap: function (improvementsComponent) {
			return this.getHousingCap2(
				improvementsComponent.getCount(improvementNames.house),
				improvementsComponent.getCount(improvementNames.house2));
			return result;
		},
		
		getHousingCap2: function (numHouses, numHouses2) {
			var result = numHouses * CampConstants.POPULATION_PER_HOUSE;
			result += numHouses2 * CampConstants.POPULATION_PER_HOUSE2;
			return result;
		},
		
		getSmithsPerSmithy: function (upgradeLevel) {
			return 2 + (upgradeLevel - 1) * 2;
		},
		
		getApothecariesPerShop: function (upgradeLevel) {
			return 2 + (upgradeLevel - 1) * 2;
		},
		
		getWorkersPerMill: function (upgradeLevel) {
			return 2 + (upgradeLevel - 1) * 2;
		},
		
		getSoldiersPerBarracks: function (upgradeLevel) {
			return 5 + Math.floor((upgradeLevel - 1) * 2.5);
		},
		
		getScientistsPerLibrary: function (upgradeLevel) {
			return 2;
		},
		
		getClericsPerTemple: function (upgradeLevel) {
			return 5;
		},
		
		getRequiredReputation: function (pop) {
			if (pop < 1) return 0;
			pop = Math.ceil(pop);
			var result = Math.max(1, Math.pow(pop, CampConstants.REPUTATION_TO_POPULATION_FACTOR) + CampConstants.REPUTATION_TO_POPULATION_OFFSET);
			return Math.floor(result * 100) / 100;
		},
		
		getMaxPopulation: function (reputation) {
			if (reputation < 1) return 0;
			return Math.floor(Math.pow(reputation - CampConstants.REPUTATION_TO_POPULATION_OFFSET, 1 / CampConstants.REPUTATION_TO_POPULATION_FACTOR));
		},
		
		getSoldierDefence: function (workerLevel, barracksLevel) {
			return (1 + workerLevel + 0.25 * barracksLevel);
		},
		
		getRumoursPerVisitMarket: function (marketLevel, marketUpgradeLevel) {
			marketLevel = marketLevel || 1;
			return CampConstants.RUMOURS_PER_VISIT_MARKET_BASE + marketLevel + (marketUpgradeLevel - 1);
		},
		
		getLibraryEvidenceGenerationPerSecond: function (libraryCount, libraryLevel) {
			var libraryLevelFactor = (1 + libraryLevel * CampConstants.EVIDENCE_BONUS_PER_LIBRARY_LEVEL);
			return 0.0015 * libraryCount * libraryLevelFactor;
		},
		
		getResearchCenterEvidenceGenerationPerSecond: function (centerCount, centerLevel) {
			var levelFactor = (1 + centerLevel * CampConstants.EVIDENCE_BONUS_PER_RESEARCH_CENTER_LEVEL);
			return 0.0015 * centerCount * levelFactor;
		},
		
		getCampfireRumourGenerationPerSecond: function (campfireCount, campfireLevel, accSpeedPopulation) {
			if (campfireCount <= 0) return 0;
			if (accSpeedPopulation <= 0) return 0;
			var campfireFactor = CampConstants.RUMOUR_BONUS_PER_CAMPFIRE_BASE;
			campfireFactor += campfireLevel > 1 ? (campfireLevel - 1) * CampConstants.RUMOURS_BONUS_PER_CAMPFIRE_PER_LEVEL : 0;
			return campfireCount * campfireFactor * accSpeedPopulation - accSpeedPopulation;
		},
		
		getMarketRumourGenerationPerSecond: function (marketCount, marketLevel, accSpeedPopulation) {
			var marketFactor = CampConstants.RUMOUR_BONUS_PER_MARKET_BASE;
			marketFactor += marketLevel > 1 ? (marketUpgradeLevel - 1) * CampConstants.RUMOURS_BONUS_PER_MARKET_PER_UPGRADE : 0;
			return marketCount > 0 ? Math.pow(marketFactor, marketCount) * accSpeedPopulation - accSpeedPopulation : 0;
		},
		
		getInnRumourGenerationPerSecond: function (innCount, innLevel, accSpeedPopulation) {
			var innFactor = CampConstants.RUMOUR_BONUS_PER_INN_BASE;
			innFactor += innLevel > 1 ? (innLevel - 1) * CampConstants.RUMOURS_BONUS_PER_INN_PER_UPGRADE : 0;
			return innCount > 0 ? Math.pow(innFactor, innCount) * accSpeedPopulation - accSpeedPopulation : 0;
		},
		
		getMeditatinSuccessRate: function (shrineLevel) {
			return 0.4 + shrineLevel * 0.1;
		}
	
	};
	
	return CampConstants;
	
});
